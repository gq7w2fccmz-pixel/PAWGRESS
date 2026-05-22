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

interface WorkoutStore {
  screen: string;
  activeArea: AreaName | null;
  session: WorkoutSession | null;
  liveLog: LiveExerciseLog;

  // Custom exercise list – shared between TrainingScreen & ActiveSetScreen
  customExercises: PlanExercise[] | null;
  customDayIndex: number | null;

  setScreen: (s: string) => void;
  setActiveArea: (a: AreaName | null) => void;
  setCustomExercises: (exercises: PlanExercise[], dayIndex: number) => void;
  getActiveExercises: (dayIndex: number) => PlanExercise[];

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
  customExercises: null,
  customDayIndex: null,

  setScreen: (screen) => set({ screen }),
  setActiveArea: (activeArea) => set({ activeArea }),

  setCustomExercises: (exercises, dayIndex) => {
    set({ customExercises: exercises, customDayIndex: dayIndex });
  },

  getActiveExercises: (dayIndex) => {
    const { customExercises, customDayIndex } = get();
    if (customExercises && customDayIndex === dayIndex) return customExercises;
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
    set(state => {
      if (!state.session) return state;
      const exercises = state.session.exercises.map((ex, i) =>
        i === exIndex ? { ...ex, done: true } : ex
      );
      return { session: { ...state.session, exercises, currentExerciseIndex: exIndex + 1 } };
    });
  },

  recordSet: (exerciseName, weight, reps) => {
    set(state => ({
      liveLog: {
        ...state.liveLog,
        [exerciseName]: [...(state.liveLog[exerciseName] ?? []), { weight, reps }],
      },
    }));
  },

  buildExerciseRecords: (): Omit<ExerciseRecord, "isPR">[] => {
    const { liveLog } = get();
    return Object.entries(liveLog)
      .filter(([, sets]) => sets.length > 0)
      .map(([name, sets]) => {
        const volume  = sets.reduce((a, s) => a + s.weight * s.reps, 0);
        const bestSet = sets.reduce((best, s) => s.weight > best.weight ? s : best, sets[0]);
        return { name, sets, volume, bestSet };
      });
  },

  resetWorkout: () => set({ session: null, liveLog: {}, customExercises: null, customDayIndex: null }),
}));
