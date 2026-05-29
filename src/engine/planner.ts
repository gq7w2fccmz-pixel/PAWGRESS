// ── Pawgress Planning Engine – Planner ───────────────────────────────────────
// Hauptfunktion: generatePlan(input) → GeneratedPlan

import type { UserInput, GeneratedPlan, TrainingDay, PlannedExercise, SplitType } from "./types";
import { getBestSplit, calcVolume, SPLIT_LABELS } from "./scorer";
import { filterExercises } from "./constraints";
import type { AreaExercise } from "../types";

// Übungsdaten werden dynamisch geladen → eigene Chunks, nicht im PlanScreen-Bundle
async function loadExercisePool(): Promise<Record<string, AreaExercise[]>> {
  const [brust, ruecken, beine, schultern, arme, core] = await Promise.all([
    import("../data/exercises_brust").then(m => m.BRUST_EXERCISES),
    import("../data/exercises_ruecken").then(m => m.RUECKEN_EXERCISES),
    import("../data/exercises_beine").then(m => m.BEINE_EXERCISES),
    import("../data/exercises_schultern").then(m => m.SCHULTERN_EXERCISES),
    import("../data/exercises_arme").then(m => m.ARME_EXERCISES),
    import("../data/exercises_core").then(m => m.CORE_EXERCISES),
  ]);
  return {
    Brust:     brust,
    Rücken:    ruecken,
    Beine:     beine,
    Schultern: schultern,
    Arme:      arme,
    Bauch:     core,
  };
}

// ── Split-Tagesstruktur ───────────────────────────────────────────────────────
const SPLIT_STRUCTURE: Record<SplitType, { label: string; muscles: string[] }[][]> = {
  upper_lower: [
    // 4-Tage-Variante
    [
      { label: "Upper A", muscles: ["Brust", "Rücken", "Schultern", "Arme"] },
      { label: "Lower A", muscles: ["Beine", "Bauch"] },
      { label: "Upper B", muscles: ["Brust", "Rücken", "Schultern", "Arme"] },
      { label: "Lower B", muscles: ["Beine", "Bauch"] },
    ],
    // 3-Tage-Variante
    [
      { label: "Upper", muscles: ["Brust", "Rücken", "Schultern", "Arme"] },
      { label: "Lower", muscles: ["Beine", "Bauch"] },
      { label: "Upper", muscles: ["Brust", "Rücken", "Schultern"] },
    ],
  ],
  push_pull_legs: [
    [
      { label: "Push",   muscles: ["Brust", "Schultern", "Arme"] },
      { label: "Pull",   muscles: ["Rücken", "Arme"] },
      { label: "Legs",   muscles: ["Beine", "Bauch"] },
    ],
  ],
  fullbody: [
    [
      { label: "Full A", muscles: ["Brust", "Rücken", "Beine", "Schultern"] },
      { label: "Full B", muscles: ["Brust", "Rücken", "Beine", "Arme"] },
    ],
  ],
  bro_split: [
    [
      { label: "Brust",     muscles: ["Brust", "Arme"] },
      { label: "Rücken",    muscles: ["Rücken", "Arme"] },
      { label: "Beine",     muscles: ["Beine", "Bauch"] },
      { label: "Schultern", muscles: ["Schultern", "Arme"] },
    ],
  ],
};

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// ── Rep/Set-Schema nach Ziel ──────────────────────────────────────────────────
function getRepScheme(input: UserInput, isCompound: boolean): { sets: number; repsMin: number; repsMax: number } {
  const { goal, intensity, trainingFocus } = input;

  let sets = isCompound ? 4 : 3;
  if (trainingFocus === "volume") sets += 1;
  if (trainingFocus === "intensity") sets -= 1;

  if (goal === "hypertrophy") return { sets, repsMin: 6, repsMax: 12 };
  if (goal === "strength")    return { sets, repsMin: 3, repsMax: 6 };
  if (goal === "fat_loss")    return { sets: sets - 1, repsMin: 12, repsMax: 20 };
  return { sets, repsMin: 8, repsMax: 15 };
}

// ── Score einer Übung für diesen User ────────────────────────────────────────
function scoreExercise(ex: AreaExercise, input: UserInput, muscleGroup: string): number {
  let score = 50;

  // Ziel-Match
  if (ex.goal?.toLowerCase().includes("hypertrophie") && input.goal === "hypertrophy") score += 20;
  if (ex.goal?.toLowerCase().includes("maximalkraft") && input.goal === "strength") score += 20;

  // Fokus-Bonus
  if (input.focusAreas.some(f => f === muscleGroup)) score += 15;

  // Compound bevorzugen bei Stärke/Hypertrophie
  if (ex.compound_isolation === "compound" && input.goal !== "fat_loss") score += 10;

  // Verletzungs-Malus für riskante Übungen
  if (ex.injury_risk === "high") score -= 20;
  if (ex.injury_risk === "medium" && input.injuries.some(i => i !== "none")) score -= 10;

  // Incline Brust bei Schulterproblemen bevorzugen
  if (input.injuries.includes("shoulder") && ex.name.toLowerCase().includes("schrägbank")) score += 15;
  if (input.injuries.includes("shoulder") && ex.name.toLowerCase().includes("incline")) score += 15;

  // Zeiteffizienz
  if (input.minutesPerSession <= 45 && ex.compound_isolation === "compound") score += 10;

  return score;
}

// ── Übungen für einen Tag auswählen ──────────────────────────────────────────
function pickExercisesForDay(
  muscles: string[],
  input: UserInput,
  volumeMap: Record<string, number>,
  usedNames: Set<string>,
  EXERCISE_POOL: Record<string, AreaExercise[]>,
): PlannedExercise[] {
  const exercises: PlannedExercise[] = [];

  // Sätze pro Session je nach Zeitbudget
  const MAX_SETS_PER_SESSION: Record<number, number> = { 45: 12, 60: 18, 75: 24, 90: 30 };
  const maxSets = MAX_SETS_PER_SESSION[input.minutesPerSession] ?? 18;

  // Sätze fair auf Muskelgruppen aufteilen
  const setsPerMuscle = Math.floor(maxSets / muscles.length);

  let totalUsedSets = 0;

  for (const mg of muscles) {
    if (totalUsedSets >= maxSets) break;

    const pool = EXERCISE_POOL[mg] ?? [];

    // usedNames nur INNERHALB eines Tages verwenden, nicht tagesübergreifend für die Auswahl
    // (das verhindert, dass spätere Muskelgruppen ausgehungert werden)
    const filtered = filterExercises(pool, input)
      .filter(ex => !usedNames.has(ex.name))
      .sort((a, b) => scoreExercise(b, input, mg) - scoreExercise(a, input, mg));

    if (filtered.length === 0) continue;

    // Zielsätze für diese Muskelgruppe
    const targetSets = Math.min(
      volumeMap[mg] ?? setsPerMuscle,
      setsPerMuscle,
      maxSets - totalUsedSets,
    );

    let addedSets = 0;
    let exIdx = 0;

    while (addedSets < targetSets && exIdx < filtered.length) {
      const ex = filtered[exIdx++];
      const scheme = getRepScheme(input, ex.compound_isolation === "compound");

      // Sätze für diese Übung: nicht mehr als nötig, mindestens 1
      const setsForEx = Math.min(scheme.sets, targetSets - addedSets);
      if (setsForEx <= 0) break;

      exercises.push({
        name: ex.name,
        muscleGroup: mg,
        sets: setsForEx,
        repsMin: scheme.repsMin,
        repsMax: scheme.repsMax,
        equipment: ex.equipment ?? [],
        isCompound: ex.compound_isolation === "compound",
        movementPattern: ex.movement_pattern ?? "",
      });

      usedNames.add(ex.name);
      addedSets += setsForEx;
      totalUsedSets += setsForEx;
    }
  }

  return exercises;
}

// ── Progression & RIR ────────────────────────────────────────────────────────
function getProgression(input: UserInput): { progression: string; rir: string; kadenz: string } {
  // Buch: Wenn Fortschritt stoppt → 5-Stufen-Modell
  // Kadenz: 2-0-X-0 (kein Zeitlupentraining)
  const kadenz = "Exzentrik 2–3 Sek. · Konzentrik kontrolliert & kraftvoll (2-0-X-0)";

  if (input.goal === "strength") return {
    progression: "Lineare Progression → bei Stagnation: Regeneration → Deload → Frequenz ↑",
    rir: "0–2",
    kadenz,
  };
  if (input.goal === "hypertrophy" && input.trainingFocus === "volume") return {
    progression: "Double Progression (Wdh. ↑, dann Gewicht ↑) → Wochenvolumen ÷ Frequenz verteilen",
    rir: "1–3",
    kadenz,
  };
  if (input.intensity === "very_intense") return {
    progression: "RPE-basiert (RPE 8–10) → Deload alle 3–4 Wochen",
    rir: "0–2",
    kadenz,
  };
  return {
    progression: "Double Progression → bei Plateau: Frequenz ↑ vor Volumen ↑",
    rir: "1–3",
    kadenz,
  };
}

// ── Hauptfunktion ─────────────────────────────────────────────────────────────
export async function generatePlan(input: UserInput): Promise<GeneratedPlan> {
  // 0. Übungsdaten laden (dynamisch → eigene Chunks)
  const EXERCISE_POOL = await loadExercisePool();

  // 1. Besten Split ermitteln
  const bestSplit = getBestSplit(input);

  // 2. Volumen berechnen
  const volumeBreakdown = calcVolume(input);
  const volumeMap: Record<string, number> = {};
  volumeBreakdown.forEach(v => { volumeMap[v.muscleGroup] = v.setsPerSession; });

  // 3. Tagesstruktur wählen
  const structures = SPLIT_STRUCTURE[bestSplit.split];
  const structure = structures.find(s => s.length === input.daysPerWeek)
    ?? structures[0];

  // Tage auffüllen wenn nötig
  const dayTemplates = input.daysPerWeek <= structure.length
    ? structure.slice(0, input.daysPerWeek)
    : [...structure, ...structure].slice(0, input.daysPerWeek);

  // 4. Übungen pro Tag auswählen
  // usedNames pro Tag frisch — Übungen dürfen zwischen Tagen wiederholt werden
  // (realistisch: Bankdrücken kann in Upper A und Upper B vorkommen)
  const days: TrainingDay[] = dayTemplates.map((template, i) => {
    // Für jede neue "Runde" des Splits usedNames leeren (A→B Zyklus)
    // Aber innerhalb eines Tages keine Duplikate
    const dayUsedNames = new Set<string>();

    const exercises = pickExercisesForDay(template.muscles, input, volumeMap, dayUsedNames, EXERCISE_POOL);
    const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
    const estimatedMinutes = Math.min(input.minutesPerSession, totalSets * 12 + 10);

    return {
      label: template.label,
      dayOfWeek: WEEKDAYS[i],
      muscleGroups: template.muscles,
      exercises,
      estimatedMinutes,
      totalSets,
    };
  });

  const { progression, rir, kadenz } = getProgression(input);
  const totalWeeklyVolume = days.reduce((s, d) => s + d.totalSets, 0);

  return {
    split: bestSplit.split,
    splitLabel: SPLIT_LABELS[bestSplit.split],
    splitScore: bestSplit.score,
    splitReasons: bestSplit.reasons,
    days,
    volumeBreakdown,
    progression,
    rir,
    kadenz,
    weeklyFrequency: `${input.daysPerWeek}x pro Woche`,
    totalWeeklyVolume,
    userInput: input,
  };
}
