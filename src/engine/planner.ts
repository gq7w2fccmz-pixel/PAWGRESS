// ── Pawgress Planning Engine – Planner ───────────────────────────────────────
import type { UserInput, GeneratedPlan, TrainingDay, PlannedExercise, SplitType } from "./types";
import { getBestSplit, calcVolume, SPLIT_LABELS, ACTUAL_SPLIT_FREQUENCY } from "./scorer";
import { filterExercises } from "./constraints";
import type { AreaExercise } from "../types";
import { generateId } from "../lib/ids";

async function loadExercisePool(): Promise<Record<string, AreaExercise[]>> {
  const [brust, ruecken, beine, schultern, arme, core] = await Promise.all([
    import("../data/exercises_brust").then(m => m.BRUST_EXERCISES),
    import("../data/exercises_ruecken").then(m => m.RUECKEN_EXERCISES),
    import("../data/exercises_beine").then(m => m.BEINE_EXERCISES),
    import("../data/exercises_schultern").then(m => m.SCHULTERN_EXERCISES),
    import("../data/exercises_arme").then(m => m.ARME_EXERCISES),
    import("../data/exercises_core").then(m => m.CORE_EXERCISES),
  ]);
  return { Brust: brust, Rücken: ruecken, Beine: beine, Schultern: schultern, Arme: arme, Bauch: core };
}

// ── Split-Struktur ─────────────────────────────────────────────────────────────
// Fix #9: Bro-Split hat nur 4 Tage-Variante mit Arme/Bauch als eigene Tage
const SPLIT_STRUCTURE: Record<SplitType, { label: string; muscles: string[] }[]> = {
  upper_lower: [
    { label: "Upper A", muscles: ["Brust", "Rücken", "Schultern", "Arme"] },
    { label: "Lower A", muscles: ["Beine", "Bauch"] },
    { label: "Upper B", muscles: ["Brust", "Rücken", "Schultern", "Arme"] },
    { label: "Lower B", muscles: ["Beine", "Bauch"] },
  ],
  push_pull_legs: [
    { label: "Push",  muscles: ["Brust", "Schultern", "Arme"] },
    { label: "Pull",  muscles: ["Rücken", "Arme"] },
    { label: "Legs",  muscles: ["Beine", "Bauch"] },
  ],
  fullbody: [
    { label: "Full A", muscles: ["Brust", "Rücken", "Beine", "Schultern"] },
    { label: "Full B", muscles: ["Brust", "Rücken", "Beine", "Arme"] },
    { label: "Full C", muscles: ["Schultern", "Rücken", "Beine", "Bauch"] },
  ],
  // Fix #9: vollständige Bro-Split-Struktur mit 5 Tagen inkl. Arme + Bauch
  bro_split: [
    { label: "Brust",     muscles: ["Brust"] },
    { label: "Rücken",    muscles: ["Rücken"] },
    { label: "Beine",     muscles: ["Beine"] },
    { label: "Schultern", muscles: ["Schultern"] },
    { label: "Arme & Bauch", muscles: ["Arme", "Bauch"] },
  ],
};

// Fix #5: Trainingstage mit Regenerations-Gap verteilen
// Statt Mo/Di/Mi → Mo/Mi/Fr (mind. 1 Ruhetag zwischen Einheiten)
function assignWeekdays(count: number): string[] {
  const ALL = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  if (count >= 6) return ALL.slice(0, 6);
  if (count >= 5) return ["Mo", "Di", "Mi", "Do", "Fr"];
  // Für 2–4 Tage: gleichmäßig mit Ruhetagen verteilen
  const patterns: Record<number, string[]> = {
    2: ["Mo", "Do"],
    3: ["Mo", "Mi", "Fr"],
    4: ["Mo", "Di", "Do", "Fr"],
  };
  return patterns[count] ?? ALL.slice(0, count);
}

// ── Rep/Set/Pause-Schema ───────────────────────────────────────────────────────
function getRepScheme(input: UserInput, isCompound: boolean): {
  sets: number; repsMin: number; repsMax: number; pauseSecs: number;
} {
  switch (input.goal) {
    case "strength":
      // Fix #5: Isolation-Übungen werden nicht im 1-Rep-Bereich trainiert
      return {
        sets:      isCompound ? 5 : 3,
        repsMin:   isCompound ? 1 : 6,
        repsMax:   isCompound ? 5 : 10,
        pauseSecs: isCompound ? (input.intensity === "very_intense" ? 300 : 180) : 90,
      };
    case "hypertrophy":
      // Fix #4: Differenzierter Reprange — Compound 6-12, Isolation 10-15
      return {
        sets:      isCompound ? 4 : 3,
        repsMin:   isCompound ? 6 : 10,
        repsMax:   isCompound ? 12 : 15,
        pauseSecs: 90,
      };
    case "strength_endurance":
      // Isolation bei Kraftausdauer etwas weniger Wdh (Technikversagen)
      return {
        sets:      isCompound ? 4 : 3,
        repsMin:   isCompound ? 15 : 12,
        repsMax:   isCompound ? 25 : 20,
        pauseSecs: 45,
      };
  }
}

// ── Übung bewerten ─────────────────────────────────────────────────────────────
function scoreExercise(ex: AreaExercise, input: UserInput, muscleGroup: string): number {
  let score = 50;

  const goalTag = ex.goal?.toLowerCase() ?? "";
  if (goalTag.includes("hypertrophie")  && input.goal === "hypertrophy")       score += 20;
  if (goalTag.includes("maximalkraft")  && input.goal === "strength")           score += 20;
  if (goalTag.includes("kraftausdauer") && input.goal === "strength_endurance") score += 20;

  if (input.focusAreas.some(f => f === muscleGroup)) score += 15;

  // Zielspezifisches Scoring
  if (input.goal === "strength") {
    if (ex.compound_isolation === "compound")  score += 20;
    if (ex.compound_isolation === "isolation") score -= 15;
  }
  if (input.goal === "hypertrophy") {
    if (ex.compound_isolation === "compound")  score += 10;
    if (ex.compound_isolation === "isolation") score += 5;
  }
  if (input.goal === "strength_endurance") {
    if (ex.compound_isolation === "compound") score += 8;
    if (ex.injury_risk === "high")   score -= 25; // hohe Ermüdung + hohes Risiko = gefährlich
    if (ex.injury_risk === "medium") score -= 10;
    if ((ex.skill ?? 3) <= 2) score += 10;        // einfache Bewegungen bevorzugen
    if ((ex.skill ?? 3) >= 4) score -= 10;
  }

  // Fix #4: Schulterverletzung — KEIN genereller Bonus für Schrägbank
  // Stattdessen: Hochrisiko-Übungen reduzieren, Maschinen bevorzugen
  if (input.injuries.includes("shoulder")) {
    if (ex.injury_risk === "high")   score -= 30;
    if (ex.injury_risk === "medium") score -= 15;
    // Maschinen sind schulterschonender als Freihantel bei Verletzung
    const name = ex.name.toLowerCase();
    if (name.includes("maschine") || name.includes("kabel")) score += 10;
    // Übungen mit Körper als festem Punkt (Klimmzüge etc.) bevorzugen
    if (ex.compound_isolation === "compound" && ex.injury_risk === "low") score += 8;
  }

  if (input.minutesPerSession <= 45 && ex.compound_isolation === "compound") score += 8;

  return score;
}

// ── Übungen pro Tag auswählen ──────────────────────────────────────────────────
function pickExercisesForDay(
  muscles: string[],
  input: UserInput,
  volumeMap: Record<string, number>,
  usedNames: Set<string>,
  EXERCISE_POOL: Record<string, AreaExercise[]>,
  weekUsedNames?: Set<string>,
): PlannedExercise[] {
  const exercises: PlannedExercise[] = [];

  const MAX_SETS: Record<number, number> = { 45: 12, 60: 18, 75: 24, 90: 30 };
  const sessionBudget = MAX_SETS[input.minutesPerSession] ?? 18;

  // Fix #5: Muskeln nach Priorität sortieren (Fokus zuerst, dann große Gruppen)
  const MUSCLE_PRIORITY: Record<string, number> = {
    Brust: 3, Rücken: 3, Beine: 3, Schultern: 2, Arme: 2, Bauch: 1,
  };
  const sortedMuscles = [...muscles].sort((a, b) => {
    const focusA = input.focusAreas.includes(a as never) ? 10 : 0;
    const focusB = input.focusAreas.includes(b as never) ? 10 : 0;
    return (focusB + (MUSCLE_PRIORITY[b] ?? 2)) - (focusA + (MUSCLE_PRIORITY[a] ?? 2));
  });

  // Fix #9: Budget proportional vorab aufteilen
  const totalRequestedSets = sortedMuscles.reduce((s, mg) => s + (volumeMap[mg] ?? 3), 0);
  const budgetPerMg: Record<string, number> = {};
  for (const mg of sortedMuscles) {
    const requested = volumeMap[mg] ?? 3;
    budgetPerMg[mg] = totalRequestedSets > sessionBudget
      ? Math.max(2, Math.floor(requested / totalRequestedSets * sessionBudget))
      : requested;
  }

  const minExercises = input.goal === "hypertrophy" ? 2 : 1;
  let totalUsedSets = 0;

  for (const mg of sortedMuscles) {
    if (totalUsedSets >= sessionBudget) break;

    const pool = EXERCISE_POOL[mg] ?? [];
    const filtered = filterExercises(pool, input)
      .filter(ex => !usedNames.has(ex.name))
      .sort((a, b) => {
        const isFocusMg = input.focusAreas.includes(mg as never);
        // Fix #4: Bei Fokus-Muskeln und kleinen Pools keinen Variations-Malus anwenden
        const variationMalus = (isFocusMg && filtered.length <= 3) ? 0 : 15;
        const scoreA = scoreExercise(a, input, mg) - (weekUsedNames?.has(a.name) ? variationMalus : 0);
        const scoreB = scoreExercise(b, input, mg) - (weekUsedNames?.has(b.name) ? variationMalus : 0);
        return scoreB - scoreA;
      });
    if (filtered.length === 0) continue;

    // Fix #8: volumeMap[mg] ist setsPerSession aus dem Volumenmodell — hat Priorität
    // Nur durch Zeitbudget begrenzen, nicht durch willkürliche Division
    const targetSets = Math.min(
      volumeMap[mg] ?? 3,
      sessionBudget - totalUsedSets,
    );

    let addedSets = 0;
    let exIdx = 0;

    while (addedSets < targetSets && exIdx < filtered.length) {
      const ex = filtered[exIdx++];
      const scheme = getRepScheme(input, ex.compound_isolation === "compound");
      const setsForEx = Math.min(scheme.sets, targetSets - addedSets);
      if (setsForEx <= 0) break;

      exercises.push({
        id:              generateId("ex"),  // Fix #3: stabile UUID
        name:            ex.name,
        muscleGroup:     mg,
        sets:            setsForEx,
        repsMin:         scheme.repsMin,
        repsMax:         scheme.repsMax,
        pauseSecs:       scheme.pauseSecs,
        equipment:       ex.equipment ?? [],
        isCompound:      ex.compound_isolation === "compound",
        movementPattern: ex.movement_pattern ?? "",
      });

      usedNames.add(ex.name);
      addedSets     += setsForEx;
      totalUsedSets += setsForEx;
    }
  }

  // Fix #5: Sicherheitsnetz — jede Muskelgruppe bekommt mind. 1 Übung/1 Satz
  // falls das Budget zu knapp war
  for (const mg of sortedMuscles) {
    const hasEx = exercises.some(e => e.muscleGroup === mg);
    if (!hasEx && totalUsedSets < sessionBudget) {
      const pool = EXERCISE_POOL[mg] ?? [];
      const fallback = filterExercises(pool, input)
        .filter(ex => !usedNames.has(ex.name))
        .sort((a, b) => scoreExercise(b, input, mg) - scoreExercise(a, input, mg))[0];
      if (fallback && totalUsedSets < sessionBudget) {
        // Fix #3: Fallback respektiert Budget — maximal 2 Sätze oder Rest
        const fallbackSets = Math.min(2, sessionBudget - totalUsedSets);
        if (fallbackSets > 0) {
          const scheme = getRepScheme(input, fallback.compound_isolation === "compound");
          exercises.push({
            id:              generateId("ex"),
            name:            fallback.name,
            muscleGroup:     mg,
            sets:            fallbackSets,
            repsMin:         scheme.repsMin,
            repsMax:         scheme.repsMax,
            pauseSecs:       scheme.pauseSecs,
            equipment:       fallback.equipment ?? [],
            isCompound:      fallback.compound_isolation === "compound",
            movementPattern: fallback.movement_pattern ?? "",
          });
          usedNames.add(fallback.name);
          totalUsedSets += fallbackSets;
        }
      }
    }
  }

  return exercises;
}

// ── Progression nach Ziel + Trainingsfokus ────────────────────────────────────
// Fix #7: Progression reagiert auf trainingFocus
function getProgression(input: UserInput): { progression: string; rir: string; kadenz: string } {
  if (input.goal === "strength") {
    if (input.trainingFocus === "intensity") return {
      progression: "Intensitätsorientiert: RPE 9–10 · Deload alle 3 Wo · dann neue Maxima",
      rir: "0–1",
      kadenz: "Exzentrik 3–4 Sek. · Konzentrik maximal explosiv",
    };
    if (input.trainingFocus === "endurance") return {
      progression: "Volumenbasiert: Sätze ↑ vor Gewicht ↑ · Frequenz ↑ bei Plateau",
      rir: "2–3",
      kadenz: "Exzentrik 2–3 Sek. · Konzentrik kontrolliert kraftvoll",
    };
    return { // balanced
      progression: "Lineare Progression (Gewicht ↑ jede Einheit) → Plateau: Deload → Frequenz ↑",
      rir: "1–2",
      kadenz: "Exzentrik 2–4 Sek. · Konzentrik explosiv (2-0-X-0)",
    };
  }

  if (input.goal === "hypertrophy") {
    if (input.trainingFocus === "intensity") return {
      progression: "Intensitätsorientiert: RPE 8–10 · Mechanische Spannung · Top-Set + Backoff",
      rir: "0–2",
      kadenz: "Exzentrik 3 Sek. · kurze Pause unten · explosiv konzentrisch",
    };
    if (input.trainingFocus === "endurance") return {
      progression: "Volumenorientiert: Wochenvolumen ÷ Frequenz · Wdh. ↑ dann Gewicht ↑",
      rir: "2–4",
      kadenz: "Gleichmäßige Kadenz · Pump-Orientiert · kein Momentum",
    };
    return {
      progression: "Double Progression (Wdh. ↑ auf Wdh.max → Gewicht ↑) · Volumen ÷ Frequenz verteilen",
      rir: "1–3",
      kadenz: "Exzentrik 2–3 Sek. · Konzentrik kontrolliert kraftvoll (2-0-X-0)",
    };
  }

  // strength_endurance
  if (input.trainingFocus === "intensity") return {
    progression: "Last ↑ bei gleicher Wdh.zahl · dann Pause ↓",
    rir: "1–2",
    kadenz: "Schnell konzentrisch · kontrolliert exzentrisch",
  };
  return {
    progression: "Pausenreduktion (−5 Sek./Wo) → Wdh. ↑ (auf 25) → Gewicht ↑ · Work Capacity aufbauen",
    rir: "2–4",
    kadenz: "Konzentrisch schnell/kraftvoll · Exzentrik kontrolliert (X-0-1-0)",
  };
}

// ── Hauptfunktion ──────────────────────────────────────────────────────────────
export async function generatePlan(input: UserInput): Promise<GeneratedPlan> {
  const EXERCISE_POOL = await loadExercisePool();

  // Fix #1: bestSplit bestimmt den Plan — Volumen muss denselben Split verwenden
  const bestSplit = getBestSplit(input);
  const usedSplit = bestSplit.split;

  // Fix #1: calcVolume bekommt den tatsächlich verwendeten Split
  const volumeBreakdown = calcVolume(input, usedSplit);
  const volumeMap: Record<string, number> = {};
  volumeBreakdown.forEach(v => { volumeMap[v.muscleGroup] = v.setsPerSession; });

  // Tagesstruktur: passende Anzahl Days
  const fullStructure = SPLIT_STRUCTURE[usedSplit];
  // Fix #3: Tage nie wiederholen — max. so viele Tage wie Struktur hat
  // Fullbody hat 3 Templates → bei 4 Tagen wird Upper/Lower besser gewählt (via scorer)
  const effectiveDays = Math.min(input.daysPerWeek, fullStructure.length);
  const dayTemplates: { label: string; muscles: string[] }[] = [];
  for (let i = 0; i < effectiveDays; i++) {
    dayTemplates.push(fullStructure[i]);
  }

  // Fix #5: Wochentage mit Regenerations-Gaps verteilen
  // Fix #2: Wochentage basieren auf effectiveDays (nicht input.daysPerWeek)
  const weekdays = assignWeekdays(effectiveDays);

  // Variation: Übungen die diese Woche bereits verwendet wurden bekommen -15 Scoring-Malus
  const weekUsedNames = new Set<string>();

  const days: TrainingDay[] = dayTemplates.map((template, i) => {
    const dayUsedNames = new Set<string>();
    const exercises = pickExercisesForDay(
      template.muscles, input, volumeMap, dayUsedNames, EXERCISE_POOL, weekUsedNames
    );
    exercises.forEach(e => weekUsedNames.add(e.name));
    const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
    return {
      label:            template.label,
      dayOfWeek:        weekdays[i],
      muscleGroups:     template.muscles,
      exercises,
      estimatedMinutes: Math.min(input.minutesPerSession, totalSets * 12 + 10),
      totalSets,
    };
  });

  const { progression, rir, kadenz } = getProgression(input);
  const totalWeeklyVolume = days.reduce((s, d) => s + d.totalSets, 0);

  return {
    split:           usedSplit,
    splitLabel:      SPLIT_LABELS[usedSplit],
    splitScore:      bestSplit.score,
    splitReasons:    bestSplit.reasons,
    days,
    volumeBreakdown,
    progression,
    rir,
    kadenz,
    weeklyFrequency: `${input.daysPerWeek}x pro Woche`,
    totalWeeklyVolume,
    userInput:       input,
  };
}
