import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BodyweightEntry {
  date: string;
  kg: number;
}

export interface Stats {
  totalWorkouts: number;
  totalVolume: number;
  weeklyWorkouts: number;
  weeklyVolume: number;
  lastWorkoutDate: string | null;
  bodyweightLog: BodyweightEntry[];
}

interface StatsStore {
  stats: Stats;
  weekDays: boolean[];
  weeklyGoal: number;
  setWeekDays: (days: boolean[]) => void;
  setWeeklyGoal: (goal: number) => void;
  addVolume: (kg: number) => void;
  finishWorkoutStats: () => void;
  checkStreakDecay: () => void;
  addBodyweight: (kg: number) => void;
  resetWeekly: () => void;
}

const DEFAULT_STATS: Stats = {
  totalWorkouts: 0,
  totalVolume: 0,
  weeklyWorkouts: 0,
  weeklyVolume: 0,
  lastWorkoutDate: null,
  bodyweightLog: [],
};

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      stats: DEFAULT_STATS,
      weekDays: [true, true, true, true, true, false, false],
      weeklyGoal: 4,

      setWeekDays: (days) => set({ weekDays: days }),
      setWeeklyGoal: (goal) => set({ weeklyGoal: goal }),
      addVolume: (kg) => {
        const { stats } = get();
        set({
          stats: {
            ...stats,
            weeklyVolume: stats.weeklyVolume + kg,
            totalVolume: stats.totalVolume + kg,
          },
        });
      },

      addBodyweight: (kg: number) => {
        const { stats } = get();
        const today = new Date().toISOString().slice(0, 10);
        const log = stats.bodyweightLog ?? [];
        // Replace today's entry if exists
        const filtered = log.filter(e => e.date !== today);
        set({ stats: { ...stats, bodyweightLog: [...filtered, { date: today, kg }].slice(-365) } });
      },

      checkStreakDecay: () => {
        const { stats } = get();
        if (!stats.lastWorkoutDate) return;

        const today = new Date();
        const last  = new Date(stats.lastWorkoutDate);

        // Normalize both to midnight UTC to avoid timezone drift
        today.setHours(0, 0, 0, 0);
        last.setHours(0, 0, 0, 0);

        const diffDays = Math.round((today.getTime() - last.getTime()) / 86_400_000);

        // Get Monday-based ISO week number for both dates
        function isoWeek(d: Date): number {
          const tmp = new Date(d);
          tmp.setHours(0, 0, 0, 0);
          tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
          const week1 = new Date(tmp.getFullYear(), 0, 4);
          return 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86_400_000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
        }

        // Reset weekly stats if we've crossed into a new ISO week
        if (diffDays > 0 && (isoWeek(today) !== isoWeek(last) || today.getFullYear() !== last.getFullYear())) {
          get().resetWeekly();
        }
      },

      finishWorkoutStats: () => {
        const { stats } = get();
        const today = new Date().toISOString().split("T")[0];
        set({
          stats: {
            ...stats,
            totalWorkouts: stats.totalWorkouts + 1,
            weeklyWorkouts: stats.weeklyWorkouts + 1,
            lastWorkoutDate: today,
          },
        });
      },

      resetWeekly: () => {
        const { stats } = get();
        set({ stats: { ...stats, weeklyWorkouts: 0, weeklyVolume: 0 } });
      },
    }),
    {
      name: "pawgress-stats",
      partialize: (s) => ({ stats: s.stats, weekDays: s.weekDays, weeklyGoal: s.weeklyGoal }),
    }
  )
);
