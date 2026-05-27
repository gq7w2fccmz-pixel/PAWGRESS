// ── Pawgress Planning Engine – Scorer ────────────────────────────────────────
import type { UserInput, SplitScore, SplitType, VolumeBreakdown } from "./types";

export const SPLIT_LABELS: Record<SplitType, string> = {
  upper_lower:    "Upper / Lower",
  push_pull_legs: "Push / Pull / Legs",
  fullbody:       "Ganzkörper",
  bro_split:      "Bro Split",
};

const SPLIT_DAY_FIT: Record<SplitType, number[]> = {
  upper_lower:    [4, 3, 5],
  push_pull_legs: [3, 6],
  fullbody:       [2, 3],
  bro_split:      [4, 5, 6],
};

export function scoreSplits(input: UserInput): SplitScore[] {
  const splits: SplitType[] = ["upper_lower", "push_pull_legs", "fullbody", "bro_split"];
  return splits.map(split => {
    let score = 50;
    const reasons: string[] = [];
    const dayFit = SPLIT_DAY_FIT[split];
    if (dayFit[0] === input.daysPerWeek) { score += 25; reasons.push("Optimale Tage-Frequenz"); }
    else if (dayFit.includes(input.daysPerWeek)) { score += 10; reasons.push("Passende Tage-Anzahl"); }
    else { score -= 20; }
    if (input.goal === "hypertrophy") {
      if (split === "upper_lower" || split === "push_pull_legs") { score += 20; reasons.push("Optimale Frequenz für Hypertrophie"); }
      if (split === "bro_split") { score -= 10; reasons.push("Niedrige Frequenz suboptimal"); }
    }
    if (input.goal === "strength") {
      if (split === "upper_lower" || split === "fullbody") { score += 20; reasons.push("Hohe Frequenz ideal für Kraft"); }
    }
    if (input.goal === "fat_loss" || input.goal === "fitness") {
      if (split === "fullbody") { score += 15; reasons.push("Maximaler Kalorienverbrauch"); }
    }
    if (input.injuries.includes("shoulder")) {
      if (split === "push_pull_legs") { score -= 10; reasons.push("Push-Days bei Schulterproblemen"); }
      if (split === "upper_lower") { score += 5; reasons.push("Schulterlast verteilbar"); }
    }
    if (input.minutesPerSession <= 45) {
      if (split === "fullbody" || split === "bro_split") score -= 15;
      if (split === "upper_lower") { score += 10; reasons.push("Zeitbudget optimal"); }
    }
    if (input.minutesPerSession >= 75) {
      if (split === "push_pull_legs" || split === "bro_split") { score += 10; reasons.push("Zeit für hohes Volumen"); }
    }
    if (input.experienceLevel === "beginner") {
      if (split === "fullbody") { score += 20; reasons.push("Optimal für Anfänger"); }
      if (split === "bro_split") { score -= 20; reasons.push("Zu niedrige Frequenz für Anfänger"); }
    }
    if (input.experienceLevel === "advanced") {
      if (split === "bro_split" || split === "push_pull_legs") { score += 10; reasons.push("Hohes Volumen für Fortgeschrittene"); }
    }
    if (input.focusAreas.includes("Brust") || input.focusAreas.includes("Schultern")) {
      if (split === "upper_lower") { score += 10; reasons.push("Oberkörper-Fokus optimal"); }
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

// ── Sportwissenschaftliche Volumentabellen ────────────────────────────────────
// Quellen: Schoenfeld 2017, Israetel MEV/MAV, Helms et al.
// MEV = Minimum Effective Volume (Sätze/Woche), MAV = Maximum Adaptive Volume

const MEV: Record<string, number> = {
  Brust: 8, Rücken: 10, Beine: 10, Schultern: 6, Arme: 6, Bauch: 6,
};
const MAV: Record<string, number> = {
  Brust: 20, Rücken: 22, Beine: 24, Schultern: 16, Arme: 14, Bauch: 16,
};

// Frequenz pro Woche je Muskelgruppe je Split
const SPLIT_FREQUENCY: Record<SplitType, Record<string, number>> = {
  fullbody:       { Brust: 2, Rücken: 2, Beine: 2, Schultern: 2, Arme: 1, Bauch: 2 },
  upper_lower:    { Brust: 2, Rücken: 2, Beine: 2, Schultern: 2, Arme: 2, Bauch: 2 },
  push_pull_legs: { Brust: 2, Rücken: 2, Beine: 2, Schultern: 2, Arme: 2, Bauch: 1 },
  bro_split:      { Brust: 1, Rücken: 1, Beine: 1, Schultern: 1, Arme: 2, Bauch: 1 },
};

// Max Sätze pro Session je Zeitbudget (begrenzt durch Erholung & Zeit)
const MAX_SETS_PER_SESSION: Record<number, number> = {
  45: 12,
  60: 18,
  75: 24,
  90: 30,
};

export function calcVolume(input: UserInput): VolumeBreakdown[] {
  const muscleGroups = ["Brust", "Rücken", "Beine", "Schultern", "Arme", "Bauch"];
  const freq = SPLIT_FREQUENCY[input.split ?? "upper_lower"];
  const maxPerSession = MAX_SETS_PER_SESSION[input.minutesPerSession] ?? 18;
  const split = input.split ?? "upper_lower";

  // Muskelgruppen die in diesem Split aktiv sind
  const activeMuscles = Object.entries(freq).filter(([, f]) => f > 0).length || muscleGroups.length;

  return muscleGroups.map(mg => {
    const mev = MEV[mg] ?? 6;
    const mav = MAV[mg] ?? 16;
    const mgFreq = freq[mg] ?? 1;

    // Zielsätze/Woche basierend auf Ziel
    let targetSets: number;
    if (input.goal === "hypertrophy" || input.trainingFocus === "volume") {
      // Näher an MAV, ~70-85%
      targetSets = Math.round(mev + (mav - mev) * 0.75);
    } else if (input.goal === "strength") {
      targetSets = Math.round(mev + (mav - mev) * 0.45);
    } else if (input.goal === "fat_loss") {
      targetSets = Math.round(mev + (mav - mev) * 0.35);
    } else {
      targetSets = Math.round(mev + (mav - mev) * 0.55);
    }

    // Fokus-Bonus: +20% Richtung MAV
    const isFocus = input.focusAreas.some(f => f === mg);
    if (isFocus) targetSets = Math.min(mav, Math.round(targetSets * 1.2));

    // Verletzungs-Reduktion
    if (input.injuries.includes("shoulder") && mg === "Schultern") targetSets = Math.round(mev * 0.5);
    if (input.injuries.includes("knee") && mg === "Beine") targetSets = Math.round(targetSets * 0.65);
    if (input.injuries.includes("back") && mg === "Rücken") targetSets = Math.round(targetSets * 0.6);

    // Session-Limit: max Sätze pro Session × Frequenz, aber auch nicht zu wenig
    const maxBySession = Math.floor((maxPerSession / activeMuscles) * mgFreq);
    const finalSets = Math.max(mev, Math.min(targetSets, maxBySession));

    // Sätze pro Session (für die Planung)
    const setsPerSession = mgFreq > 0 ? Math.ceil(finalSets / mgFreq) : finalSets;

    const recommended =
      isFocus ? "above" :
      input.injuries.some(i => i !== "none") && mg === "Schultern" ? "reduced" :
      "optimal";

    return {
      muscleGroup: mg,
      setsPerWeek: finalSets,
      setsPerSession,
      recommended,
    };
  });
}
