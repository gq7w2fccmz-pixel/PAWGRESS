// ── Pawgress Planning Engine – Scorer ────────────────────────────────────────
// Bewertet Split-Optionen und ermittelt optimales Volumen

import type { UserInput, SplitScore, SplitType, VolumeBreakdown } from "./types";

// ── Split-Definitionen ────────────────────────────────────────────────────────
export const SPLIT_LABELS: Record<SplitType, string> = {
  upper_lower:    "Upper / Lower",
  push_pull_legs: "Push / Pull / Legs",
  fullbody:       "Ganzkörper",
  bro_split:      "Bro Split",
};

// Welche Splits sind für wie viele Tage geeignet?
const SPLIT_DAY_FIT: Record<SplitType, number[]> = {
  upper_lower:    [4, 3, 5],
  push_pull_legs: [3, 6],
  fullbody:       [2, 3],
  bro_split:      [4, 5, 6],
};

// ── Scoring-Regeln ────────────────────────────────────────────────────────────
export function scoreSplits(input: UserInput): SplitScore[] {
  const splits: SplitType[] = ["upper_lower", "push_pull_legs", "fullbody", "bro_split"];

  return splits.map(split => {
    let score = 50;
    const reasons: string[] = [];

    // Tage-Fit
    const dayFit = SPLIT_DAY_FIT[split];
    if (dayFit[0] === input.daysPerWeek) {
      score += 25;
      reasons.push("Optimale Tage-Frequenz");
    } else if (dayFit.includes(input.daysPerWeek)) {
      score += 10;
      reasons.push("Passende Tage-Anzahl");
    } else {
      score -= 20;
      reasons.push("Suboptimale Tage-Anzahl");
    }

    // Ziel-Fit
    if (input.goal === "hypertrophy") {
      if (split === "upper_lower" || split === "push_pull_legs") { score += 20; reasons.push("Optimale Frequenz für Hypertrophie"); }
      if (split === "bro_split") { score -= 10; reasons.push("Niedrige Frequenz suboptimal für Hypertrophie"); }
    }
    if (input.goal === "strength") {
      if (split === "upper_lower" || split === "fullbody") { score += 20; reasons.push("Hohe Frequenz ideal für Kraftaufbau"); }
    }
    if (input.goal === "fat_loss" || input.goal === "fitness") {
      if (split === "fullbody") { score += 15; reasons.push("Maximaler Kalorienverbrauch pro Session"); }
    }

    // Verletzungs-Fit
    if (input.injuries.includes("shoulder")) {
      if (split === "push_pull_legs") { score -= 10; reasons.push("Push-Days problematisch bei Schulterproblemen"); }
      if (split === "upper_lower") { score += 5; reasons.push("Schulterlast verteilbar"); }
    }

    // Zeit-Fit
    if (input.minutesPerSession <= 45) {
      if (split === "fullbody" || split === "bro_split") { score -= 15; }
      if (split === "upper_lower") { score += 10; reasons.push("Zeitbudget optimal nutzbar"); }
    }
    if (input.minutesPerSession >= 75) {
      if (split === "push_pull_legs" || split === "bro_split") { score += 10; reasons.push("Ausreichend Zeit für hohes Volumen"); }
    }

    // Experience-Fit
    if (input.experienceLevel === "beginner") {
      if (split === "fullbody") { score += 20; reasons.push("Optimale Frequenz für Anfänger"); }
      if (split === "bro_split") { score -= 20; reasons.push("Zu niedrige Frequenz für Anfänger"); }
    }
    if (input.experienceLevel === "advanced") {
      if (split === "bro_split" || split === "push_pull_legs") { score += 10; reasons.push("Hohes Volumen für Fortgeschrittene"); }
    }

    // Fokus-Fit: Brust/Schulter Fokus → Upper/Lower besser
    if (input.focusAreas.includes("Brust") || input.focusAreas.includes("Schultern")) {
      if (split === "upper_lower") { score += 10; reasons.push("Oberkörper-Fokus optimal abbildbar"); }
    }
    if (input.focusAreas.includes("Beine")) {
      if (split === "push_pull_legs" || split === "upper_lower") { score += 10; reasons.push("Dedizierter Bein-Tag möglich"); }
    }

    return { split, score: Math.max(0, Math.min(100, score)), reasons };
  }).sort((a, b) => b.score - a.score);
}

export function getBestSplit(input: UserInput): SplitScore {
  return scoreSplits(input)[0];
}

// ── Volumentabellen ───────────────────────────────────────────────────────────
// Empfohlene Sätze/Woche nach Ziel und Muskelgruppe
const BASE_VOLUME: Record<string, number> = {
  Brust: 12, Rücken: 14, Beine: 16, Schultern: 10, Arme: 8, Bauch: 8,
};

const GOAL_MULTIPLIER: Record<UserInput["goal"], number> = {
  hypertrophy: 1.3,
  strength:    1.0,
  fat_loss:    0.85,
  fitness:     1.0,
};

const FOCUS_BONUS = 4; // Extra-Sätze für Fokus-Muskel

export function calcVolume(input: UserInput): VolumeBreakdown[] {
  const multiplier = GOAL_MULTIPLIER[input.goal];
  const muscleGroups = ["Brust", "Rücken", "Beine", "Schultern", "Arme", "Bauch"];

  return muscleGroups.map(mg => {
    let sets = Math.round((BASE_VOLUME[mg] ?? 10) * multiplier);

    // Fokus-Bonus
    const isFocus = input.focusAreas.some(f =>
      f === mg || (f === "Rücken" && mg === "Rücken")
    );
    if (isFocus) sets += FOCUS_BONUS;

    // Verletzungs-Reduktion
    if (input.injuries.includes("shoulder") && mg === "Schultern") {
      sets = Math.round(sets * 0.5);
    }
    if (input.injuries.includes("knee") && mg === "Beine") {
      sets = Math.round(sets * 0.7);
    }
    if (input.injuries.includes("back") && mg === "Rücken") {
      sets = Math.round(sets * 0.6);
    }

    // Zeit-Limit: max ~5 Sätze/Session, x Tage
    const maxWeeklySets = Math.floor(input.minutesPerSession / 10) * input.daysPerWeek;
    const perMuscle = Math.min(sets, Math.round(maxWeeklySets / muscleGroups.length) + 2);

    const recommended =
      isFocus ? "above" :
      (input.injuries.some(i => i !== "none") && sets < (BASE_VOLUME[mg] ?? 10)) ? "reduced" :
      "optimal";

    return { muscleGroup: mg, setsPerWeek: Math.max(4, perMuscle), recommended };
  });
}
