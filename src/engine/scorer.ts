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

    // Tages-Fit
    if (dayFit[0] === input.daysPerWeek) { score += 20; reasons.push("Optimale Tage-Frequenz"); }
    else if (dayFit.includes(input.daysPerWeek)) { score += 8; reasons.push("Passende Tage-Anzahl"); }
    else { score -= 20; }

    // ── Buch-Hierarchie: Erfahrungslevel → Split ──────────────────────────────
    // Anfänger: Ganzkörper (2–4×/Woche)
    if (input.experienceLevel === "beginner") {
      if (split === "fullbody") { score += 30; reasons.push("Buchempfehlung: Ganzkörper für Anfänger"); }
      if (split === "bro_split") { score -= 30; reasons.push("Frequenz 1 suboptimal für Anfänger"); }
      if (split === "push_pull_legs") { score -= 15; reasons.push("Zu komplex für Anfänger"); }
    }
    // Fortg. Anfänger / Intermediate: Upper/Lower (Frequenz 2)
    if (input.experienceLevel === "intermediate") {
      if (split === "upper_lower") { score += 25; reasons.push("Buchempfehlung: 2er-Split für Fortg. Anfänger"); }
      if (split === "fullbody") { score += 5; reasons.push("Noch geeignet"); }
      if (split === "bro_split") { score -= 20; reasons.push("Frequenz 1 suboptimal"); }
    }
    // Fortgeschrittene: PPL / Upper-Lower (Frequenz 2–3)
    if (input.experienceLevel === "advanced") {
      if (split === "push_pull_legs") { score += 25; reasons.push("Buchempfehlung: 3er-Split für Fortgeschrittene"); }
      if (split === "upper_lower") { score += 15; reasons.push("Frequenz 2 sehr effektiv"); }
      if (split === "bro_split" && input.daysPerWeek >= 5) { score += 5; reasons.push("Bei sehr hohem Volumen sinnvoll"); }
    }

    // ── Ziel-Anpassung ────────────────────────────────────────────────────────
    if (input.goal === "hypertrophy") {
      if (split === "upper_lower" || split === "push_pull_legs") { score += 15; reasons.push("Frequenz 2–3 optimal für Hypertrophie"); }
      if (split === "bro_split") { score -= 15; reasons.push("Buch: Frequenz 1 suboptimal für Masse"); }
    }
    if (input.goal === "strength") {
      if (split === "upper_lower" || split === "fullbody") { score += 15; reasons.push("Hohe Frequenz ideal für Kraft"); }
    }
    if (input.goal === "fat_loss" || input.goal === "fitness") {
      if (split === "fullbody") { score += 10; reasons.push("Maximaler Kalorienverbrauch"); }
    }

    // ── Verletzungen ──────────────────────────────────────────────────────────
    if (input.injuries.includes("shoulder")) {
      if (split === "push_pull_legs") { score -= 10; reasons.push("Push-Days belasten Schulter"); }
      if (split === "upper_lower") { score += 5; reasons.push("Schulterlast verteilbar"); }
    }

    // ── Zeit ──────────────────────────────────────────────────────────────────
    if (input.minutesPerSession <= 45) {
      if (split === "upper_lower") { score += 10; reasons.push("Zeitbudget optimal für 2er-Split"); }
      if (split === "push_pull_legs") { score -= 10; }
    }
    if (input.minutesPerSession >= 75) {
      if (split === "push_pull_legs") { score += 8; reasons.push("Zeit für hohes Volumen"); }
    }

    // ── Fokusgebiete ──────────────────────────────────────────────────────────
    if (input.focusAreas.includes("Beine")) {
      if (split === "push_pull_legs" || split === "upper_lower") { score += 8; reasons.push("Dedizierter Bein-Tag möglich"); }
    }

    return { split, score: Math.max(0, Math.min(100, score)), reasons };
  }).sort((a, b) => b.score - a.score);
}

export function getBestSplit(input: UserInput): SplitScore {
  return scoreSplits(input)[0];
}

// ── Sportwissenschaftliche Volumentabellen ────────────────────────────────────
// Buchempfehlungen: Minimum = MEV, Optimal = Zielbereich, Hoch = MAV
// Quelle: Satzempfehlungen Kapitel (Buchrekonstruktion)
const MEV: Record<string, number> = {
  Brust: 8, Rücken: 8, Beine: 8, Schultern: 8,
  Arme: 6, Bauch: 6,
  // Für "Quads" und "Beinbeuger" getrennt
};

// MAV = "Hoch"-Wert aus dem Buch
const MAV: Record<string, number> = {
  Brust: 20, Rücken: 20, Beine: 20, Schultern: 20,
  Arme: 18, Bauch: 16,
};

// Optimaler Bereich (Buchempfehlung "Optimal") → Zielwert
const OPTIMAL: Record<string, number> = {
  Brust: 15, Rücken: 15, Beine: 15, Schultern: 15,
  Arme: 12, Bauch: 12,
};

// Frequenz pro Woche je Muskelgruppe je Split
// Buch: Frequenz 2-3 > Frequenz 1 (klar bevorzugt)
const SPLIT_FREQUENCY: Record<SplitType, Record<string, number>> = {
  fullbody:       { Brust: 3, Rücken: 3, Beine: 3, Schultern: 3, Arme: 2, Bauch: 3 },
  upper_lower:    { Brust: 2, Rücken: 2, Beine: 2, Schultern: 2, Arme: 2, Bauch: 2 },
  push_pull_legs: { Brust: 2, Rücken: 2, Beine: 2, Schultern: 2, Arme: 2, Bauch: 1 },
  bro_split:      { Brust: 1, Rücken: 1, Beine: 1, Schultern: 1, Arme: 2, Bauch: 1 },
};

export function calcVolume(input: UserInput): VolumeBreakdown[] {
  const muscleGroups = ["Brust", "Rücken", "Beine", "Schultern", "Arme", "Bauch"];
  const freq = SPLIT_FREQUENCY[input.split ?? "upper_lower"];
  return muscleGroups.map(mg => {
    const mev     = MEV[mg] ?? 6;
    const mav     = MAV[mg] ?? 20;
    const optimal = OPTIMAL[mg] ?? 15;
    const mgFreq  = freq[mg] ?? 1;

    // Buch-Logik: Zielvolumen abhängig vom Trainingsziel
    let targetSets: number;
    if (input.goal === "hypertrophy" || input.trainingFocus === "volume") {
      targetSets = optimal; // Buchempfehlung "Optimal"
    } else if (input.goal === "strength") {
      targetSets = Math.round(mev + (optimal - mev) * 0.6);
    } else if (input.goal === "fat_loss") {
      targetSets = Math.round(mev + (optimal - mev) * 0.5);
    } else {
      targetSets = Math.round(mev + (optimal - mev) * 0.7);
    }

    // Fokus-Bonus: Richtung MAV
    const isFocus = input.focusAreas.some(f => f === mg);
    if (isFocus) targetSets = Math.min(mav, Math.round(targetSets * 1.25));

    // Verletzungs-Reduktion
    if (input.injuries.includes("shoulder") && mg === "Schultern") targetSets = mev;
    if (input.injuries.includes("knee") && mg === "Beine") targetSets = Math.round(targetSets * 0.65);
    if (input.injuries.includes("back") && mg === "Rücken") targetSets = Math.round(targetSets * 0.6);

    // Wochenvolumen auf Frequenz verteilen (Buch: Wochenvolumen ÷ Frequenz)
    // Session-Cap: Buch sagt nach 6-10 Sätzen pro Muskel sinkt Grenznutzen
    const SESSION_CAP_PER_MUSCLE = 10;
    const rawPerSession = mgFreq > 0 ? Math.ceil(targetSets / mgFreq) : targetSets;
    const setsPerSession = Math.min(rawPerSession, SESSION_CAP_PER_MUSCLE);
    const finalSets = Math.max(mev, Math.min(setsPerSession * mgFreq, mav));

    const recommended =
      isFocus ? "above" :
      input.injuries.some(i => i !== "none") ? "reduced" :
      "optimal";

    return { muscleGroup: mg, setsPerWeek: finalSets, setsPerSession, recommended };
  });
}
