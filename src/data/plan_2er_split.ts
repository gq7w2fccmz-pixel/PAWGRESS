export interface PlanExercise {
  name: string;
  sets: { reps: number }[];
  primary_muscles?: string[];
}

export interface PlanDay {
  id: string;
  label: string;
  tag: string;
  color: string;
  exercises: PlanExercise[];
}

export const PLAN_2ER_SPLIT: PlanDay[] = [
  // ── PUSH A ────────────────────────────────────────────────────────────────
  {
    id: "push_a", label: "Push A", tag: "PUSH", color: "#f97316",
    exercises: [
      { name: "Beinstrecken Maschine",              sets: [{reps:8},{reps:8},{reps:8}] },
      { name: "Wadenheben im Stehen Maschine",      sets: [{reps:20},{reps:20},{reps:20},{reps:20}] },
      { name: "Hackenschmidt Kniebeuge",            sets: [{reps:6},{reps:10}] },
      { name: "Adduktoren Maschine",                sets: [{reps:8},{reps:8},{reps:8}] },
      { name: "Brustpresse",                        sets: [{reps:6},{reps:8}] },
      { name: "Schräge Brustpresse Maschine",       sets: [{reps:8},{reps:8}] },
      { name: "Fliegende Kabelzug von unten",       sets: [{reps:8},{reps:8}] },
      { name: "Butterfly weit",                     sets: [{reps:8},{reps:8}] },
      { name: "Seitheben im Stehen KH",             sets: [{reps:8},{reps:8},{reps:8},{reps:8},{reps:8}] },
      { name: "Trizepsdrücken Kabelzug",            sets: [{reps:8},{reps:8},{reps:8},{reps:8}] },
    ],
  },

  // ── PULL A ────────────────────────────────────────────────────────────────
  {
    id: "pull_a", label: "Pull A", tag: "PULL", color: "#3b82f6",
    exercises: [
      { name: "Rumänisches Kreuzheben LH",                  sets: [{reps:6},{reps:8}] },
      { name: "Beinbeuger sitzend Maschine",                sets: [{reps:8},{reps:8},{reps:8}] },
      { name: "Latzug weit",                                sets: [{reps:8},{reps:8},{reps:8}] },
      { name: "Rudern von oben mit Brustauflage Maschine",  sets: [{reps:8},{reps:8},{reps:8}] },
      { name: "Rudern von unten mit Brustauflage Maschine", sets: [{reps:8},{reps:8},{reps:8}] },
      { name: "Preacher Curls Maschine",                    sets: [{reps:8},{reps:8},{reps:8},{reps:8}] },
      { name: "Butterfly Reverse Maschine",                 sets: [{reps:8},{reps:8}] },
      { name: "Bauchmaschine Dual",                         sets: [{reps:8},{reps:8},{reps:8},{reps:8}] },
    ],
  },

  // ── PUSH B ────────────────────────────────────────────────────────────────
  {
    id: "push_b", label: "Push B", tag: "PUSH", color: "#f97316",
    exercises: [
      { name: "Schräge Brustpresse Maschine",       sets: [{reps:6},{reps:10}] },
      { name: "Butterfly weit",                     sets: [{reps:10},{reps:10},{reps:10},{reps:10}] },
      { name: "Fliegende KH Schrägbank",            sets: [{reps:10},{reps:10}] },
      { name: "Beinstrecken Maschine",              sets: [{reps:10},{reps:10},{reps:10}] },
      { name: "Beinpresse Dual",                    sets: [{reps:10},{reps:10}] },
      { name: "Adduktoren Maschine",                sets: [{reps:10},{reps:10},{reps:10}] },
      { name: "Seitheben KH auf der Schrägbank",   sets: [{reps:10},{reps:10},{reps:10},{reps:10},{reps:10}] },
      { name: "Trizeps Kickbacks Kabelzug",         sets: [{reps:10},{reps:10},{reps:10},{reps:10}] },
      { name: "Wadenheben im Stehen Maschine",      sets: [{reps:20},{reps:20},{reps:20},{reps:20}] },
    ],
  },

  // ── PULL B ────────────────────────────────────────────────────────────────
  {
    id: "pull_b", label: "Pull B", tag: "PULL", color: "#3b82f6",
    exercises: [
      { name: "T-Bar Rudern mit Brustauflage Maschine", sets: [{reps:6},{reps:10}] },
      { name: "Latzug neutral",                          sets: [{reps:10},{reps:10},{reps:10}] },
      { name: "Überzüge am Kabel",                       sets: [{reps:10},{reps:10},{reps:10}] },
      { name: "Rumänisches Kreuzheben LH",               sets: [{reps:6},{reps:10}] },
      { name: "Beinbeuger liegend Maschine",             sets: [{reps:10},{reps:10},{reps:10}] },
      { name: "Spider Curls KH",                         sets: [{reps:10},{reps:10},{reps:10},{reps:10}] },
      { name: "Butterfly Reverse Maschine",              sets: [{reps:10},{reps:10}] },
      { name: "Bauchmaschine Dual",                      sets: [{reps:10},{reps:10},{reps:10},{reps:10}] },
    ],
  },
];
