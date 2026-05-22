import { create } from "zustand";
import type { AreaName } from "../types";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";
import type { SetRecord, ExerciseRecord } from "./historyStore";

export interface WorkoutSession {
  dayIndex: number;
  startTime: number;
  currentExerciseIndex: number;
  currentSet: number;
  isActive: boolean;
  exercises: { name: string; done: boolean }[];
}

// Tracks recorded sets per exercise during active workout (survives navigation)
export interface LiveExerciseLog {
  [exerciseName: string]: SetRecord[];
}

interface WorkoutStore {
  screen: string;
  activeArea: AreaName | null;
  session: WorkoutSession | null;
  liveLog: LiveExerciseLog;            // persists across route changes

  setScreen: (s: string) => void;
  setActiveArea: (a: AreaName | null) => void;
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

  setScreen: (screen) => set({ screen }),
  setActiveArea: (activeArea) => set({ activeArea }),

  startWorkout: (totalWorkouts) => {
    const dayIndex = totalWorkouts % 4;
    const day = PLAN_2ER_SPLIT[dayIndex];
    set({
      liveLog: {},                      // clear previous session log
      session: {
        dayIndex,
        startTime: Date.now(),
        currentExerciseIndex: 0,
        currentSet: 1,
        isActive: true,
        exercises: day.exercises.map(e => ({ name: e.name, done: false })),
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

  // BUG #7 fix: recordSet stores into workoutStore, survives route changes
  recordSet: (exerciseName, weight, reps) => {
    set(state => ({
      liveLog: {
        ...state.liveLog,
        [exerciseName]: [...(state.liveLog[exerciseName] ?? []), { weight, reps }],
      },
    }));
  },

  buildExerciseRecords: () => {
    const { liveLog } = get();
    return Object.entries(liveLog)
      .filter(([, sets]) => sets.length > 0)
      .map(([name, sets]) => {
        const volume  = sets.reduce((a, s) => a + s.weight * s.reps, 0);
        const bestSet = sets.reduce((best, s) => s.weight > best.weight ? s : best, sets[0]);
        return { name, sets, volume, bestSet };
      });
  },

  resetWorkout: () => set({ session: null, liveLog: {} }),
}));
