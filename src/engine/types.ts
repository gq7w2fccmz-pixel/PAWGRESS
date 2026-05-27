// ── Pawgress Planning Engine – Types ─────────────────────────────────────────

export type Goal = "hypertrophy" | "strength" | "fat_loss" | "fitness";
export type FocusArea = "Brust" | "Rücken" | "Beine" | "Schultern" | "Arme" | "Bauch";
export type SplitType = "upper_lower" | "push_pull_legs" | "fullbody" | "bro_split";
export type TrainingFocus = "balanced" | "volume" | "intensity";
export type Intensity = "moderate" | "demanding" | "very_intense";
export type TrainingStyle = "classic" | "powerbuilding" | "bodybuilding";
export type Equipment = "gym" | "home_gym" | "minimal";
export type TimeSlot = 45 | 60 | 75 | 90;
export type Injury = "shoulder" | "knee" | "back" | "none";

export interface UserInput {
  goal: Goal;
  focusAreas: FocusArea[];
  daysPerWeek: 2 | 3 | 4 | 5 | 6;
  split: SplitType;
  trainingFocus: TrainingFocus;
  intensity: Intensity;
  trainingStyle: TrainingStyle;
  equipment: Equipment;
  minutesPerSession: TimeSlot;
  injuries: Injury[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
}

export interface PlannedExercise {
  name: string;
  muscleGroup: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  equipment: string[];
  isCompound: boolean;
  movementPattern: string;
}

export interface TrainingDay {
  label: string;          // "Upper A", "Push", "Lower B" …
  dayOfWeek: string;      // "Mo", "Di" …
  muscleGroups: string[];
  exercises: PlannedExercise[];
  estimatedMinutes: number;
  totalSets: number;
}

export interface VolumeBreakdown {
  muscleGroup: string;
  setsPerWeek: number;
  setsPerSession: number;  // Sätze pro Training-Einheit
  recommended: string;     // "optimal" | "above" | "reduced"
}

export interface SplitScore {
  split: SplitType;
  score: number;
  reasons: string[];
}

export interface GeneratedPlan {
  split: SplitType;
  splitLabel: string;
  splitScore: number;
  splitReasons: string[];
  days: TrainingDay[];
  volumeBreakdown: VolumeBreakdown[];
  progression: string;
  rir: string;
  weeklyFrequency: string;
  totalWeeklyVolume: number;
  userInput: UserInput;
}
