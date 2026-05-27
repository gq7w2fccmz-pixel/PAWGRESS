import { create } from "zustand";
import type { AreaName } from "../types";
import { PLAN_2ER_SPLIT, type PlanExercise } from "../data/plan_2er_split";
import type { SetRecord, ExerciseRecord } from "./historyStore";

export interface WorkoutSession {
  dayIndex: number;
  startTime: number;
  currentExerciseIndex: number;
  isActive: boolean;
  exercises: { name: string; done: boolean }[];
}

export interface LiveExerciseLog {
  [exerciseName: string]: SetRecord[];
}

// Tracks current set progress per exercise index so back-navigation preserves state
export interface ExSetProgress {
  currentSet: number;    // completedSets + 1 (next set to do, 1-based)
  totalSets?: number;    // user-adjusted total (overrides plan value)
  weight: number;
  reps: number;
  done: boolean;         // exercise fully completed
}

interface WorkoutStore {
  screen: string;
  activeArea: AreaName | null;
  session: WorkoutSession | null;
  liveLog: LiveExerciseLog;

  // Set progress per exercise (survives back-navigation)
  setProgress: Record<number, ExSetProgress>;

  // Custom exercise list – shared between TrainingScreen & ActiveSetScreen
  customExercises: PlanExercise[] | null;
  customDayIndex: number | null;

  setScreen: (s: string) => void;
  setActiveArea: (a: AreaName | null) => void;
  setCustomExercises: (exercises: PlanExercise[], dayIndex: number) => void;
  getActiveExercises: (dayIndex: number) => PlanExercise[];

  // Set progress actions
  getSetProgress: (exIndex: number, defaultReps: number) => ExSetProgress;
  updateSetProgress: (exIndex: number, updates: Partial<ExSetProgress>) => void;
  advanceSet: (exIndex: number, defaultReps: number) => void;
  clearSetProgress: () => void;

  startWorkout: (totalWorkouts: number) => void;
  completeExercise: (exIndex: number) => void;
  recordSet: (exerciseName: string, weight: number, reps: number) => void;
  buildExerciseRecords: () => Omit<ExerciseRecord, "isPR">[];
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()((set, get) => ({
  screen: "home",
  activeArea: null,
  session: null,
  liveLog: {},
  setProgress: {},
  customExercises: null,
  customDayIndex: null,

  setScreen: (screen) => set({ screen }),
  setActiveArea: (activeArea) => set({ activeArea }),

  setCustomExercises: (exercises, dayIndex) => {
    const { session } = get();
    // If a session is running, sync session.exercises to the new list
    // so activeExercises.length stays accurate during workout
    if (session) {
      const updatedSessionExercises = exercises.map((ex, i) => ({
        name: ex.name,
        done: session.exercises[i]?.done ?? false,
      }));
      set({
        customExercises: exercises,
        customDayIndex: dayIndex,
        session: { ...session, exercises: updatedSessionExercises },
      });
    } else {
      set({ customExercises: exercises, customDayIndex: dayIndex });
    }
  },

  getActiveExercises: (dayIndex) => {
    const { customExercises } = get();
    // If user explicitly customised the exercise list, always use it
    if (customExercises) return customExercises;
    return PLAN_2ER_SPLIT[dayIndex].exercises;
  },

  startWorkout: (totalWorkouts) => {
    const dayIndex = totalWorkouts % 4;
    const exercises = get().getActiveExercises(dayIndex);
    set({
      liveLog: {},
      session: {
        dayIndex,
        startTime: Date.now(),
        currentExerciseIndex: 0,
        isActive: true,
        exercises: exercises.map(e => ({ name: e.name, done: false })),
      },
    });
  },

  completeExercise: (exIndex) => {
    set((state: WorkoutStore) => {
      if (!state.session) return state;
      const exercises = state.session.exercises.map((ex, i) =>
        i === exIndex ? { ...ex, done: true } : ex
      );
      return { session: { ...state.session, exercises, currentExerciseIndex: exIndex + 1 } };
    });
  },

  recordSet: (exerciseName, weight, reps) => {
    set((state: WorkoutStore) => ({
      liveLog: {
        ...state.liveLog,
        [exerciseName]: [...(state.liveLog[exerciseName] ?? []), { weight, reps }],
      },
    }));
  },

  buildExerciseRecords: (): Omit<ExerciseRecord, "isPR">[] => {
    const liveLog = get().liveLog as Record<string, SetRecord[]>;
    return Object.entries(liveLog)
      .filter(([, sets]) => sets.length > 0)
      .map(([name, sets]) => {
        const volume  = sets.reduce((a, s) => a + s.weight * s.reps, 0);
        const bestSet = sets.reduce((best, s) => s.weight > best.weight ? s : best, sets[0]);
        return { name, sets, volume, bestSet };
      });
  },

  getSetProgress: (exIndex, defaultReps) => {
    return get().setProgress[exIndex] ?? { currentSet: 1, weight: 0, reps: defaultReps, done: false };
  },

  updateSetProgress: (exIndex, updates) => {
    set(state => ({
      setProgress: {
        ...state.setProgress,
        [exIndex]: { ...( state.setProgress[exIndex] ?? { currentSet: 1, weight: 0, reps: 8, done: false }), ...updates },
      },
    }));
  },

  advanceSet: (exIndex, defaultReps) => {
    const current = get().setProgress[exIndex] ?? { currentSet: 1, weight: 0, reps: defaultReps, done: false };
    set(state => ({
      setProgress: {
        ...state.setProgress,
        [exIndex]: { ...current, currentSet: current.currentSet + 1 },
      },
    }));
  },

  clearSetProgress: () => set({ setProgress: {} }),

  resetWorkout: () => set({ session: null, liveLog: {}, setProgress: {}, customExercises: null, customDayIndex: null }),
}));
