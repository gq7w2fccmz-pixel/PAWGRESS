// ── Pawgress Planning Engine – Constraints ───────────────────────────────────
// Harte Ausschlusskriterien — nicht verhandelbar

import type { UserInput } from "./types";
import type { AreaExercise } from "../types";

// Equipment-Mapping: Was ist in welchem Setting verfügbar?
const EQUIPMENT_WHITELIST: Record<string, string[]> = {
  gym: [
    "Langhantel", "Kurzhanteln", "Flachbank", "Schrägbank", "Kabelzug",
    "Multipresse", "Klimmzugstange", "Dip-Station", "Latzug", "Rudermaschine",
    "Beinpresse", "Beinstrecker", "Beincurl", "Schulterpresse Maschine",
    "Brustpresse Maschine", "Butterfly Maschine", "Trizepsdrücken Maschine",
    "Beinpresse Maschine", "Wadenheben Maschine", "Hyperextension",
    "Roman Chair", "Hantelbank", "Bank"
  ],
  home_gym: [
    "Kurzhanteln", "Langhantel", "Flachbank", "Schrägbank",
    "Klimmzugstange", "Dip-Station", "Kabelzug", "Bank"
  ],
  minimal: [
    "Kurzhanteln", "Klimmzugstange", "Boden", "Bank"
  ],
};

// Verletzungs-Blacklist: Welche Movement-Patterns / Übungen sind gesperrt?
const INJURY_BLACKLIST: Record<string, { patterns: string[]; names: string[] }> = {
  shoulder: {
    patterns: ["vertical_push", "overhead"],
    names: ["Overhead Press", "Military Press", "OHP", "Behind Neck", "Nacken"],
  },
  knee: {
    patterns: [],
    names: ["Kniebeuge", "Beinpresse tief", "Ausfallschritt"],
  },
  back: {
    patterns: ["hinge"],
    names: ["Kreuzheben", "Good Morning", "Hyperextension"],
  },
};

export function passesEquipmentConstraint(
  ex: AreaExercise,
  equipment: UserInput["equipment"],
): boolean {
  if (!ex.equipment || ex.equipment.length === 0) return true;
  const whitelist = EQUIPMENT_WHITELIST[equipment];
  // Mind. 1 Equipment-Item muss verfügbar sein
  return ex.equipment.some(e => whitelist.includes(e));
}

export function passesInjuryConstraint(
  ex: AreaExercise,
  injuries: UserInput["injuries"],
): boolean {
  for (const injury of injuries) {
    if (injury === "none") continue;
    const blacklist = INJURY_BLACKLIST[injury];
    if (!blacklist) continue;

    // Pattern-Check
    if (ex.movement_pattern && blacklist.patterns.includes(ex.movement_pattern)) {
      return false;
    }
    // Name-Check
    if (blacklist.names.some(n => ex.name.toLowerCase().includes(n.toLowerCase()))) {
      return false;
    }
  }
  return true;
}

export function passesExperienceConstraint(
  ex: AreaExercise,
  level: UserInput["experienceLevel"],
): boolean {
  if (!ex.experience_level || ex.experience_level === "Alle Level") return true;
  if (level === "advanced") return true;
  if (level === "intermediate") return ex.experience_level !== "Fortgeschritten" || (ex.skill ?? 3) <= 4;
  // beginner: nur Anfänger-Übungen
  return ex.experience_level === "Anfänger";
}

export function filterExercises(
  exercises: AreaExercise[],
  input: UserInput,
): AreaExercise[] {
  return exercises.filter(ex =>
    passesEquipmentConstraint(ex, input.equipment) &&
    passesInjuryConstraint(ex, input.injuries) &&
    passesExperienceConstraint(ex, input.experienceLevel)
  );
}
