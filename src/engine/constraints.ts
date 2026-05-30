// ── Pawgress Planning Engine – Constraints ───────────────────────────────────
import type { UserInput } from "./types";
import type { AreaExercise } from "../types";

// Equipment-Whitelist
const EQUIPMENT_WHITELIST: Record<string, string[]> = {
  gym: [
    "Langhantel", "Kurzhanteln", "Flachbank", "Schrägbank", "Kabelzug",
    "Multipresse", "Klimmzugstange", "Dip-Station", "Latzug", "Rudermaschine",
    "Beinpresse", "Beinstrecker", "Beincurl", "Schulterpresse Maschine",
    "Brustpresse Maschine", "Butterfly Maschine", "Trizepsdrücken Maschine",
    "Beinpresse Maschine", "Wadenheben Maschine", "Hyperextension",
    "Roman Chair", "Hantelbank", "Bank",
  ],
  home_gym: [
    "Kurzhanteln", "Langhantel", "Flachbank", "Schrägbank",
    "Klimmzugstange", "Dip-Station", "Kabelzug", "Bank",
  ],
  minimal: ["Kurzhanteln", "Klimmzugstange", "Boden", "Bank"],
};

// Fix #5: Erweiterte Schulter-Verletzungs-Blacklist mit allen Overhead-Varianten
const INJURY_BLACKLIST: Record<string, { patterns: string[]; keywords: string[] }> = {
  shoulder: {
    patterns: ["vertical_push", "overhead"],
    keywords: [
      "overhead", "military", "ohp", "nacken", "behind neck",
      "arnold", "push press", "landmine press",
      "schulterdrücken", "front raise", "frontheben",
    ],
  },
  knee: {
    patterns: [],
    keywords: ["kniebeuge", "beinpresse tief", "ausfallschritt", "lunge", "split squat"],
  },
  back: {
    patterns: ["hinge"],
    keywords: ["kreuzheben", "good morning", "hyperextension", "romanian"],
  },
};

// Fix #6: Equipment-Constraint — unterscheidet Pflicht- von Optional-Equipment
// Pflicht-Equipment = erstes Element in der Liste (ohne das geht die Übung nicht)
// Optional = zusätzliche Items (z.B. Ablage, Handtuch)
export function passesEquipmentConstraint(
  ex: AreaExercise,
  equipment: UserInput["equipment"],
): boolean {
  if (!ex.equipment || ex.equipment.length === 0) return true;
  const whitelist = EQUIPMENT_WHITELIST[equipment];

  // Fix #4: Unterscheidung nach Setting
  // Gym: mind. 1 Equipment-Item muss verfügbar sein (viele Alternativen vorhanden)
  // Home/Minimal: erstes Item muss verfügbar sein (weniger Alternativen)
  if (equipment === "gym") {
    return ex.equipment.some(e => whitelist.includes(e));
  }
  // home_gym / minimal: primäres Equipment muss vorhanden sein
  return whitelist.includes(ex.equipment[0]);
}

// Fix #5: Keyword-basierter Injury-Check — deckt Varianten ab
export function passesInjuryConstraint(
  ex: AreaExercise,
  injuries: UserInput["injuries"],
): boolean {
  for (const injury of injuries) {
    if (injury === "none") continue;
    const blacklist = INJURY_BLACKLIST[injury];
    if (!blacklist) continue;

    if (ex.movement_pattern && blacklist.patterns.includes(ex.movement_pattern)) return false;

    // Fix #5: Alle Keywords prüfen (nicht nur hardcodierte Namen)
    const nameLower = ex.name.toLowerCase();
    if (blacklist.keywords.some(k => nameLower.includes(k))) return false;
  }
  return true;
}

// Fix #7: Fallback auf "Alle Level" wenn experience_level nicht gesetzt
export function passesExperienceConstraint(
  ex: AreaExercise,
  level: UserInput["experienceLevel"],
): boolean {
  const exLevel = ex.experience_level;
  // Fix #7: Fehlende oder unbekannte Werte → immer zulassen (verhindert leere Pools)
  if (!exLevel || exLevel === "Alle Level") return true;
  if (level === "advanced") return true;
  if (level === "intermediate") return exLevel !== "Fortgeschritten" || (ex.skill ?? 3) <= 4;
  // beginner: Anfänger + "Alle Level" (bereits oben abgefangen)
  return exLevel === "Anfänger";
}

export function filterExercises(exercises: AreaExercise[], input: UserInput): AreaExercise[] {
  const filtered = exercises.filter(ex =>
    passesEquipmentConstraint(ex, input.equipment) &&
    passesInjuryConstraint(ex, input.injuries) &&
    passesExperienceConstraint(ex, input.experienceLevel)
  );
  // Fix #7: Wenn Pool leer → Fallback ohne Experience-Filter (verhindert leere Tage)
  if (filtered.length === 0) {
    return exercises.filter(ex =>
      passesEquipmentConstraint(ex, input.equipment) &&
      passesInjuryConstraint(ex, input.injuries)
    );
  }
  return filtered;
}
