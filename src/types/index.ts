export type AreaName =
  | "BRUST"
  | "RUECKEN"
  | "BEINE"
  | "SCHULTERN"
  | "ARME"
  | "CORE"
  | "CARDIO"
  | "STRETCH";

export type ScreenName =
  | "home"
  | "plan"
  | "coaches"
  | "training"
  | "active-set"
  | "workout-done"
  | "profil"
  | "gym-area";

export interface Exercise {
  name: string;
  sub: string;
  weight: number | null;
  reps: number;
  sets: number;
  done: boolean;
}

export interface CoachInfo {
  emoji: string;
  name: string;
  role: string;
  tip: string;
}

export interface AreaExercise {
  num: number;
  name: string;
  sub: string;
  desc: string;
  primary: string;
  secondary: string;
  // Backend-relevante Felder
  category?: string;                          // z.B. "Grundübung · Compound · Horizontal Push"
  goal?: string;                              // z.B. "Hypertrophie · Maximalkraft"
  movement_pattern?: string;                  // z.B. "horizontal_push"
  compound_isolation?: "compound" | "isolation";
  unilateral?: boolean;                       // true = einseitig
  equipment?: string[];                       // z.B. ["Langhantel", "Flachbank"]
  skill?: number;                             // 1–5
  stabilisation?: number;                     // 1–5
  load?: number;                              // 1–5
  fatigue_score?: number;                     // 1–5 (abgeleitet)
  stability_demand?: number;                  // 1–5
  injury_risk?: "low" | "medium" | "high";
  experience_level?: "Anfänger" | "Fortgeschritten" | "Alle Level";
  regressions?: string[];
  progressions?: string[];
  cues?: string[];
  errors_technique?: string[];
  errors_safety?: string[];
  safety_note?: string;
  rom?: string;
  breathing?: string;
  start_position?: string;
  execution?: string;
}

export interface AreaData {
  color: string;
  desc?: string;
  coach: CoachInfo;
  exercises: AreaExercise[];
  tips: string[];
}

export interface GymArea {
  name: AreaName;
  color: string;
  img: string;
}

export interface Plan {
  name: string;
  desc: string;
  days: number;
  level: string;
  icon: string;
  color: string;
  tag?: boolean;
}

export interface Coach {
  name: string;
  title: string;
  desc: string;
  focus: string;
  color: string;
  emoji: string;
  heroImage?: string;
  focusIcon?: string;
}

export interface LockedCoach {
  name: string;
  title: string;
  req: string;
  sub: string;
  p: number;
  max: number;
  color: string;
  emoji: string;
  heroImage?: string;
  desc?: string;
  focus?: string;
}
