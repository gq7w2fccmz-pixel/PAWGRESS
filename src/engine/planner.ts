// ── Pawgress Planning Engine – Planner ───────────────────────────────────────
// Hauptfunktion: generatePlan(input) → GeneratedPlan

import type { UserInput, GeneratedPlan, TrainingDay, PlannedExercise, SplitType } from "./types";
import { getBestSplit, calcVolume, SPLIT_LABELS } from "./scorer";
import { filterExercises } from "./constraints";
import type { AreaExercise } from "../types";

// Lazy imports der Übungsdaten
import { BRUST_EXERCISES }    from "../data/exercises_brust";
import { RUECKEN_EXERCISES }  from "../data/exercises_ruecken";
import { BEINE_EXERCISES }    from "../data/exercises_beine";
import { SCHULTERN_EXERCISES } from "../data/exercises_schultern";
import { ARME_EXERCISES }     from "../data/exercises_arme";
import { CORE_EXERCISES }     from "../data/exercises_core";

// ── Übungspool pro Muskelgruppe ───────────────────────────────────────────────
const EXERCISE_POOL: Record<string, AreaExercise[]> = {
  Brust:     BRUST_EXERCISES,
  Rücken:    RUECKEN_EXERCISES,
  Beine:     BEINE_EXERCISES,
  Schultern: SCHULTERN_EXERCISES,
  Arme:      ARME_EXERCISES,
  Bauch:     CORE_EXERCISES,
};

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
): PlannedExercise[] {
  const exercises: PlannedExercise[] = [];
  const setsPerMinute = 0.08; // ~1 Satz / 12 Minuten
  const maxSets = Math.floor(input.minutesPerSession * setsPerMinute);
  let usedSets = 0;

  for (const mg of muscles) {
    const pool = EXERCISE_POOL[mg] ?? [];
    const filtered = filterExercises(pool, input)
      .filter(ex => !usedNames.has(ex.name))
      .sort((a, b) => scoreExercise(b, input, mg) - scoreExercise(a, input, mg));

    const targetSets = volumeMap[mg] ?? 8;
    // Pro Tag: ca. 40-60% des Wochenvolumens (bei 2x Frequenz)
    const daySets = Math.min(Math.ceil(targetSets / 2), Math.floor(maxSets * 0.4));

    let addedSets = 0;
    let exIdx = 0;

    while (addedSets < daySets && exIdx < filtered.length && usedSets < maxSets) {
      const ex = filtered[exIdx++];
      const scheme = getRepScheme(input, ex.compound_isolation === "compound");
      const setsForEx = Math.min(scheme.sets, daySets - addedSets);

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
      usedSets += setsForEx;
    }
  }

  return exercises;
}

// ── Progression & RIR ────────────────────────────────────────────────────────
function getProgression(input: UserInput): { progression: string; rir: string } {
  if (input.goal === "strength") return { progression: "Linear Progression", rir: "0-1" };
  if (input.trainingStyle === "powerbuilding") return { progression: "Double Progression + 1RM", rir: "1-2" };
  if (input.intensity === "very_intense") return { progression: "RPE-basiert", rir: "0-1" };
  return { progression: "Double Progression", rir: "1-2" };
}

// ── Hauptfunktion ─────────────────────────────────────────────────────────────
export function generatePlan(input: UserInput): GeneratedPlan {
  // 1. Besten Split ermitteln
  const bestSplit = getBestSplit(input);

  // 2. Volumen berechnen
  const volumeBreakdown = calcVolume(input);
  const volumeMap: Record<string, number> = {};
  volumeBreakdown.forEach(v => { volumeMap[v.muscleGroup] = v.setsPerWeek; });

  // 3. Tagesstruktur wählen
  const structures = SPLIT_STRUCTURE[bestSplit.split];
  const structure = structures.find(s => s.length === input.daysPerWeek)
    ?? structures[0];

  // Tage auffüllen wenn nötig
  const dayTemplates = input.daysPerWeek <= structure.length
    ? structure.slice(0, input.daysPerWeek)
    : [...structure, ...structure].slice(0, input.daysPerWeek);

  // 4. Übungen pro Tag auswählen
  const usedNames = new Set<string>();
  const days: TrainingDay[] = dayTemplates.map((template, i) => {
    // Für A/B-Varianten: usedNames nach jedem Paar resetten
    if (i % structure.length === 0 && i > 0) usedNames.clear();

    const exercises = pickExercisesForDay(template.muscles, input, volumeMap, usedNames);
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

  const { progression, rir } = getProgression(input);
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
    weeklyFrequency: `${input.daysPerWeek}x pro Woche`,
    totalWeeklyVolume,
    userInput: input,
  };
}
