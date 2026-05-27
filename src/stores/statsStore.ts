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
  weeklyGoal: number;
  setWeekDays: (days: boolean[]) => void;
  setWeeklyGoal: (goal: number) => void;
  addVolume: (kg: number) => void;
  finishWorkoutStats: () => void;
  checkStreakDecay: () => void;
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

      checkStreakDecay: () => {
        const { stats } = get();
        if (!stats.lastWorkoutDate) return;
        const today = new Date().toISOString().split("T")[0];
        const last  = new Date(stats.lastWorkoutDate);
        const now   = new Date(today);
        const diffDays = Math.floor((now.getTime() - last.getTime()) / 86_400_000);
        // If more than 1 day has passed without a workout, streak is broken
        if (diffDays > 1) {
          set({ stats: { ...stats } }); // streak tracking via coachStore separately
        }
        // Reset weekly if new week started (Mon = 1)
        const lastDay = last.getDay();
        const todayDay = now.getDay();
        if (diffDays >= 7 || (todayDay <= lastDay && diffDays > 0)) {
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
