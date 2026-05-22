import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Stats {
  totalWorkouts: number;
  totalVolume: number;
  weeklyWorkouts: number;
  weeklyVolume: number;
  lastWorkoutDate: string | null;
}

interface StatsStore {
  stats: Stats;
  weekDays: boolean[];
  addVolume: (kg: number) => void;
  finishWorkoutStats: () => void;
  resetWeekly: () => void;
}

const DEFAULT_STATS: Stats = {
  totalWorkouts: 0,
  totalVolume: 0,
  weeklyWorkouts: 0,
  weeklyVolume: 0,
  lastWorkoutDate: null,
};

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      stats: DEFAULT_STATS,
      weekDays: [true, true, true, true, true, false, false],

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
      partialize: (s) => ({ stats: s.stats, weekDays: s.weekDays }),
    }
  )
);
