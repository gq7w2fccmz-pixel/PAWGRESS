import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SetRecord {
  weight: number;   // kg (0 = bodyweight)
  reps: number;
}

export interface ExerciseRecord {
  name: string;
  sets: SetRecord[];
  volume: number;        // weight × reps summed
  bestSet: SetRecord;    // highest weight in this session
  isPR: boolean;         // best weight ever for this exercise
}

export interface WorkoutRecord {
  id: string;            // ISO timestamp
  date: string;          // YYYY-MM-DD
  dayLabel: string;      // "Push A", "Pull B" etc.
  dayTag: "PUSH" | "PULL";
  durationSeconds: number;
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  exercises: ExerciseRecord[];
}

// Per-exercise personal records: name → best weight ever
type PRMap = Record<string, number>;

interface HistoryStore {
  workouts: WorkoutRecord[];
  personalRecords: PRMap;

  // Called when a workout finishes
  saveWorkout: (record: Omit<WorkoutRecord, "id"> & {
    exercises: Omit<ExerciseRecord, "isPR">[];
  }) => WorkoutRecord;

  // Query helpers
  getWorkoutById: (id: string) => WorkoutRecord | undefined;
  getExerciseHistory: (name: string) => { date: string; bestSet: SetRecord; volume: number }[];
  getPR: (name: string) => number;
  getWeeklyVolume: (weeksBack?: number) => number;
  getRecentWorkouts: (limit?: number) => WorkoutRecord[];
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      workouts: [],
      personalRecords: {},

      saveWorkout: (raw) => {
        const { personalRecords, workouts } = get();
        const updatedPRs = { ...personalRecords };

        // Mark PRs and update PR map
        const exercises: ExerciseRecord[] = raw.exercises.map(ex => {
          const prevBest = updatedPRs[ex.name] ?? 0;
          const isPR = ex.bestSet.weight > prevBest;
          if (isPR) updatedPRs[ex.name] = ex.bestSet.weight;
          return { ...ex, isPR };
        });

        const record: WorkoutRecord = {
          ...raw,
          id: new Date().toISOString(),
          exercises,
        };

        set({
          workouts: [record, ...workouts].slice(0, 200), // keep last 200
          personalRecords: updatedPRs,
        });

        return record;
      },

      getWorkoutById: (id) => get().workouts.find(w => w.id === id),

      getExerciseHistory: (name) =>
        get().workouts
          .filter(w => w.exercises.some(e => e.name === name))
          .map(w => {
            const ex = w.exercises.find(e => e.name === name)!;
            return { date: w.date, bestSet: ex.bestSet, volume: ex.volume };
          })
          .slice(0, 30),

      getPR: (name) => get().personalRecords[name] ?? 0,

      getWeeklyVolume: (weeksBack = 0) => {
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay() - weeksBack * 7);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 7);
        return get().workouts
          .filter(w => w.date >= start.toISOString().split("T")[0] &&
                       w.date <  end.toISOString().split("T")[0])
          .reduce((a, w) => a + w.totalVolume, 0);
      },

      getRecentWorkouts: (limit = 10) => get().workouts.slice(0, limit),
    }),
    {
      name: "pawgress-history",
      partialize: (s) => ({
        workouts: s.workouts,
        personalRecords: s.personalRecords,
      }),
    }
  )
);
