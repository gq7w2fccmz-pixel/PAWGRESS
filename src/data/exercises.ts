import type { Exercise } from "../types";

export const PUSH_DAY_EXERCISES: Exercise[] = [
  { name: "Bankdrücken",           sub: "Langhantel · 4 Sätze",    weight: 82.5, reps: 8,  sets: 4, done: false },
  { name: "Schrägbank Kurzhantel", sub: "Brust (oben) · 3 Sätze",  weight: 30,   reps: 10, sets: 3, done: false },
  { name: "Schulterdrücken",       sub: "Schulter · 3 Sätze",      weight: 42.5, reps: 8,  sets: 3, done: false },
  { name: "Dips",                  sub: "Trizeps · 3 Sätze",       weight: null, reps: 10, sets: 3, done: false },
  { name: "Seitheben",             sub: "Schultern · 3 Sätze",     weight: 12,   reps: 15, sets: 3, done: false },
  { name: "Trizeps Pushdown",      sub: "Trizeps · 3 Sätze",       weight: 47.5, reps: 12, sets: 3, done: false },
];

export const WORKOUT_TIPS: Record<string, string> = {
  Bankdrücken:           "Kontrolliere in der Absenkung. Explosiv nach oben.",
  "Schrägbank Kurzhantel": "Volle Dehnung unten, starke Kontraktion oben.",
  Schulterdrücken:       "Keine Hohlkreuz — Core anspannen.",
  Dips:                  "Leicht nach vorne neigen für mehr Brustanteil.",
  Seitheben:             "Ellbogen leicht gebeugt, langsam absenken.",
  "Trizeps Pushdown":    "Oberarme fest am Körper halten.",
};
