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
  fullbody:       [2, 3],     // Fix #9: Fullbody passt nur zu 2–3 Tagen
  bro_split:      [4, 5],     // Fix #9: Bro-Split nur 4–5 (nicht 6 – kein Arme/Bauch-Tag)
};

export function scoreSplits(input: UserInput): SplitScore[] {
  const splits: SplitType[] = ["upper_lower", "push_pull_legs", "fullbody", "bro_split"];
  return splits.map(split => {
    let score = 50;
    const reasons: string[] = [];
    const dayFit = SPLIT_DAY_FIT[split];

    if (dayFit[0] === input.daysPerWeek)         { score += 20; reasons.push("Optimale Tage-Frequenz"); }
    else if (dayFit.includes(input.daysPerWeek)) { score += 8;  reasons.push("Passende Tage-Anzahl"); }
    else                                          { score -= 25; }

    // Erfahrungslevel
    if (input.experienceLevel === "beginner") {
      if (split === "fullbody")       { score += 30; reasons.push("Buchempfehlung: Ganzkörper für Anfänger"); }
      if (split === "bro_split")      { score -= 30; reasons.push("Frequenz 1 ungeeignet für Anfänger"); }
      if (split === "push_pull_legs") { score -= 15; reasons.push("Zu komplex für Anfänger"); }
    }
    if (input.experienceLevel === "intermediate") {
      if (split === "upper_lower") { score += 25; reasons.push("2er-Split ideal für Fortg. Anfänger"); }
      if (split === "bro_split")   { score -= 20; reasons.push("Frequenz 1 suboptimal"); }
    }
    if (input.experienceLevel === "advanced") {
      if (split === "push_pull_legs") { score += 25; reasons.push("3er-Split optimal für Fortgeschrittene"); }
      if (split === "upper_lower")    { score += 15; reasons.push("Frequenz 2 sehr effektiv"); }
    }

    // Ziel-Scoring
    if (input.goal === "strength") {
      if (split === "upper_lower" || split === "fullbody") { score += 18; reasons.push("Hohe Frequenz ideal für Kraft"); }
      if (split === "bro_split")                           { score -= 20; reasons.push("Frequenz 1 hemmt Kraftentwicklung"); }
    }
    if (input.goal === "hypertrophy") {
      if (split === "upper_lower" || split === "push_pull_legs") { score += 15; reasons.push("Frequenz 2–3 optimal für Hypertrophie"); }
      if (split === "bro_split")                                  { score -= 15; reasons.push("Frequenz 1 suboptimal für Masse"); }
    }
    if (input.goal === "strength_endurance") {
      if (split === "fullbody")    { score += 25; reasons.push("Maximale Frequenz ideal für Kraftausdauer"); }
      if (split === "upper_lower") { score += 15; reasons.push("Frequenz 2 gut für Kraftausdauer"); }
      if (split === "bro_split")   { score -= 25; reasons.push("Frequenz 1 ungeeignet für Kraftausdauer"); }
    }

    // Verletzungen
    if (input.injuries.includes("shoulder")) {
      if (split === "push_pull_legs") { score -= 10; reasons.push("Push-Days belasten Schulter"); }
      if (split === "upper_lower")    { score += 5;  reasons.push("Schulterlast gut verteilbar"); }
    }

    // Zeitbudget
    if (input.minutesPerSession <= 45) {
      if (split === "upper_lower")    { score += 10; reasons.push("Kurze Sessions gut geeignet"); }
      if (split === "push_pull_legs") { score -= 10; }
    }
    if (input.minutesPerSession >= 75) {
      if (split === "push_pull_legs") { score += 8; reasons.push("Zeit für hohes Volumen"); }
    }

    if (input.focusAreas.includes("Beine")) {
      if (split !== "bro_split") { score += 8; reasons.push("Dedizierter Bein-Tag möglich"); }
    }

    return { split, score: Math.max(0, Math.min(100, score)), reasons };
  }).sort((a, b) => b.score - a.score);
}

export function getBestSplit(input: UserInput): SplitScore {
  return scoreSplits(input)[0];
}

// ── Tatsächliche Frequenz pro Muskelgruppe aus der Splitstruktur ──────────────
// Fix #1 + #6: Frequenz wird aus dem TATSÄCHLICH verwendeten Split berechnet,
// nicht aus input.split. Und die Frequenz spiegelt die echte Tagesstruktur wider.
// Fix #1: Frequenz durch Tagessimulation — einzig korrekte Methode
// Zählt wie oft jede Muskelgruppe in den ersten daysPerWeek Trainingstagen vorkommt
// (Zyklus wiederholt sich modulo Zykluslänge)
const SPLIT_DAY_MUSCLES: Record<SplitType, string[][]> = {
  upper_lower: [
    ["Brust", "Rücken", "Schultern", "Arme"],  // Upper A
    ["Beine", "Bauch"],                           // Lower A
    ["Brust", "Rücken", "Schultern", "Arme"],  // Upper B
    ["Beine", "Bauch"],                           // Lower B
  ],
  push_pull_legs: [
    ["Brust", "Schultern", "Arme"],               // Push
    ["Rücken", "Arme"],                           // Pull
    ["Beine", "Bauch"],                           // Legs
  ],
  fullbody: [
    ["Brust", "Rücken", "Beine", "Schultern"],  // Full A
    ["Brust", "Rücken", "Beine", "Arme"],       // Full B
    ["Schultern", "Rücken", "Beine", "Bauch"],  // Full C
  ],
  bro_split: [
    ["Brust"],
    ["Rücken"],
    ["Beine"],
    ["Schultern"],
    ["Arme", "Bauch"],
  ],
};

export function getActualFrequency(
  split: SplitType,
  daysPerWeek: number,
): Record<string, number> {
  const dayMuscles = SPLIT_DAY_MUSCLES[split];
  const cycle      = dayMuscles.length;
  const freq: Record<string, number> = {};

  // Zähle wie oft jede Muskelgruppe in den ersten daysPerWeek Tagen trainiert wird
  for (let day = 0; day < daysPerWeek; day++) {
    const muscles = dayMuscles[day % cycle];
    for (const mg of muscles) {
      freq[mg] = (freq[mg] ?? 0) + 1;
    }
  }

  // Sicherheitsnetz: alle bekannten Muskelgruppen mit mind. 1 belegen
  for (const mg of ["Brust", "Rücken", "Beine", "Schultern", "Arme", "Bauch"]) {
    if (!freq[mg]) freq[mg] = 1;
  }

  return freq;
}


export const ACTUAL_SPLIT_FREQUENCY = {
  fullbody:       getActualFrequency("fullbody",       3),
  upper_lower:    getActualFrequency("upper_lower",    4),
  push_pull_legs: getActualFrequency("push_pull_legs", 3),
  bro_split:      getActualFrequency("bro_split",      4),
};

// ── Volumentabellen ────────────────────────────────────────────────────────────
const MEV: Record<string, number> = {
  Brust: 8, Rücken: 8, Beine: 8, Schultern: 8, Arme: 6, Bauch: 6,
};
const MAV: Record<string, number> = {
  Brust: 20, Rücken: 20, Beine: 20, Schultern: 20, Arme: 18, Bauch: 16,
};
const OPTIMAL_HYPERTROPHY: Record<string, number> = {
  Brust: 15, Rücken: 15, Beine: 15, Schultern: 15, Arme: 12, Bauch: 12,
};

// Fix #1: bestSplit wird als Parameter übergeben, nicht input.split verwendet
export function calcVolume(input: UserInput, usedSplit: SplitType): VolumeBreakdown[] {
  const muscleGroups = ["Brust", "Rücken", "Beine", "Schultern", "Arme", "Bauch"];
  // Fix #1 + #2: Frequenz basierend auf Split UND tatsächlichen Trainingstagen
  const freq = getActualFrequency(usedSplit, input.daysPerWeek);

  return muscleGroups.map(mg => {
    const mev     = MEV[mg] ?? 6;
    const mav     = MAV[mg] ?? 20;
    const optimal = OPTIMAL_HYPERTROPHY[mg] ?? 15;
    const mgFreq  = freq[mg] ?? 1;

    // Zielvolumen nach Trainingsziel
    let targetSets: number;
    switch (input.goal) {
      case "strength":
        // Weniger Volumen, höhere Intensität (literaturkonsistent)
        targetSets = Math.round(mev + (optimal - mev) * 0.35);
        break;
      case "hypertrophy":
        targetSets = optimal;
        break;
      case "strength_endurance":
        // Fix #3: Kraftausdauer = moderate Sätze × hohe Frequenz
        // Mehr Sätze als Kraft (viele Wdh. nötig), weniger als Hypertrophie
        targetSets = Math.round(mev + (optimal - mev) * 0.55);
        break;
    }

    // Trainingsfokus
    if (input.trainingFocus === "intensity") targetSets = Math.round(targetSets * 0.85);
    if (input.trainingFocus === "endurance") targetSets = Math.round(targetSets * 1.10);

    // Fix #2: Fokus-Bonus — erst nach Session-Cap anwenden, damit er nicht weggedeckelt wird
    const isFocus = input.focusAreas.some(f => f === mg);

    // Fix #3: Verletzungsreduktion mit eigenem Untergrenze-Wert (nicht MEV)
    // MEV als Untergrenze würde bei Schulter-Verletzung zurück auf 8 Sätze springen
    let injuryReduced = false;
    if (input.injuries.includes("shoulder") && mg === "Schultern") {
      targetSets = Math.round(mev * 0.5); // 50% von MEV = deutliche Reduktion
      injuryReduced = true;
    }
    if (input.injuries.includes("knee") && mg === "Beine") {
      targetSets = Math.round(targetSets * 0.5);
      injuryReduced = true;
    }
    if (input.injuries.includes("back") && mg === "Rücken") {
      targetSets = Math.round(targetSets * 0.5);
      injuryReduced = true;
    }

    // Session-Cap: angepasst für Fokus-Muskeln
    const SESSION_CAP = input.goal === "strength" ? 6 : (isFocus ? 12 : 10);

    if (isFocus && !injuryReduced) targetSets = Math.min(mav, Math.round(targetSets * 1.25));

    const setsPerSession = Math.min(
      mgFreq > 0 ? Math.ceil(targetSets / mgFreq) : targetSets,
      SESSION_CAP,
    );
    // Fix #3: Unteres Limit je nach Verletzung anders
    const minSets = injuryReduced ? Math.max(2, Math.round(mev * 0.5)) : mev;
    // Fix #4: floor statt ceil für finalSets vermeidet systematischen Volumenüberschuss
    const finalSets = Math.max(minSets, Math.min(setsPerSession * mgFreq, mav));

    return {
      muscleGroup:    mg,
      setsPerWeek:    finalSets,
      setsPerSession,
      recommended:    isFocus ? "above" : input.injuries.some(i => i !== "none") ? "reduced" : "optimal",
    };
  });
}
