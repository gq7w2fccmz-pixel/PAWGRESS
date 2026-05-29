/**
 * usePawgressStore – Legacy bridge + Supabase Sync
 *
 * Neu: Nach jeder relevanten Aktion wird automatisch in Supabase gespeichert.
 * Die localStorage-Persistenz bleibt als Offline-Fallback erhalten.
 */
import { useStatsStore }  from "../stores/statsStore";
import { useCoachStore, categorizeExercises } from "../stores/coachStore";
import { useWorkoutStore } from "../stores/workoutStore";
import { useHistoryStore } from "../stores/historyStore";
import type { AreaName }  from "../types";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";
import type { WorkoutInput } from "../stores/historyStore";
import {
  saveStats,
  saveCoaches,
  saveHistory,
  saveWorkoutEntry,
  savePersonalRecords,
} from "../lib/syncService";

export function usePawgressStore() {
  // ── Stats ────────────────────────────────────────────────────
  const stats              = useStatsStore(s => s.stats);
  const weekDays           = useStatsStore(s => s.weekDays);
  const weeklyGoal         = useStatsStore(s => s.weeklyGoal);
  const setWeekDays        = useStatsStore(s => s.setWeekDays);
  const setWeeklyGoal      = useStatsStore(s => s.setWeeklyGoal);
  const addVolume          = useStatsStore(s => s.addVolume);
  const finishWorkoutStats = useStatsStore(s => s.finishWorkoutStats);

  // ── Coach ────────────────────────────────────────────────────
  const selectedCoach      = useCoachStore(s => s.selectedCoach);
  const coachProgress      = useCoachStore(s => s.coachProgress);
  const setCoach           = useCoachStore(s => s.setCoach);
  const isCoachUnlocked    = useCoachStore(s => s.isCoachUnlocked);
  const getCoachProgress   = useCoachStore(s => s.getCoachProgress);
  const updateAfterWorkout = useCoachStore(s => s.updateAfterWorkout);

  // ── History ──────────────────────────────────────────────────
  const saveWorkout        = useHistoryStore(s => s.saveWorkout);
  const getPR              = useHistoryStore(s => s.getPR);
  const getRecentWorkouts  = useHistoryStore(s => s.getRecentWorkouts);
  const getExerciseHistory = useHistoryStore(s => s.getExerciseHistory);

  // ── Workout / Navigation ─────────────────────────────────────
  const screen              = useWorkoutStore(s => s.screen);
  const activeArea          = useWorkoutStore(s => s.activeArea);
  const session             = useWorkoutStore(s => s.session);
  const setScreen           = useWorkoutStore(s => s.setScreen);
  const setActiveArea       = useWorkoutStore(s => s.setActiveArea);
  const startWorkoutSession = useWorkoutStore(s => s.startWorkout);
  const completeExerciseWS  = useWorkoutStore(s => s.completeExercise);
  const buildExerciseRecords = useWorkoutStore(s => s.buildExerciseRecords);
  const resetWorkout        = useWorkoutStore(s => s.resetWorkout);

  return {
    // ── State ────────────────────────────────────────────────────
    stats,
    weekDays,
    weeklyGoal,
    setWeekDays: async (days: boolean[]) => {
      setWeekDays(days);
      const s = useStatsStore.getState();
      await saveStats(s.stats, days, s.weeklyGoal);
    },
    setWeeklyGoal: async (goal: number) => {
      setWeeklyGoal(goal);
      const s = useStatsStore.getState();
      await saveStats(s.stats, s.weekDays, goal);
    },
    selectedCoach,
    coachProgress,
    screen,
    activeArea,
    session,

    // ── Navigation ───────────────────────────────────────────────
    setScreen,
    setActiveArea: (area: AreaName | null) => setActiveArea(area),

    // ── Coach ────────────────────────────────────────────────────
    setCoach: async (name: string) => {
      setCoach(name);
      const c = useCoachStore.getState();
      await saveCoaches(name, c.coachProgress);
    },
    isCoachUnlocked,
    getCoachProgress: (name: string) => {
      const t = stats.totalWorkouts;
      const overrides: Record<string, { current: number; max: number }> = {
        Pam:  { current: Math.min(t, 1),  max: 1  },
        Otto: { current: Math.min(t, 20), max: 20 },
        Wolfi:{ current: Math.min(t, 40), max: 40 },
      };
      return overrides[name] ?? getCoachProgress(name);
    },

    // ── Workout ──────────────────────────────────────────────────
    startWorkout: () => {
      // Ausgewählte Übungen sichern bevor resetWorkout() sie löscht
      const savedCustom = useWorkoutStore.getState().customExercises;
      const savedDayIdx = useWorkoutStore.getState().customDayIndex;
      resetWorkout();
      // Übungen wiederherstellen damit startWorkoutSession die richtigen lädt
      if (savedCustom) {
        useWorkoutStore.getState().setCustomExercises(savedCustom, savedDayIdx ?? 0);
      }
      startWorkoutSession(stats.totalWorkouts);
    },

    completeSet: (_exIndex: number, weight: number, reps: number) => {
      addVolume(weight * reps);
    },

    completeExercise: (exIndex: number) => {
      completeExerciseWS(exIndex);
    },

    finishWorkout: async (
      exerciseCategories: string[],
      benchPressWeight?: number,
      startTime?: number,
    ) => {
      const cats     = categorizeExercises(exerciseCategories);
      const newTotal = stats.totalWorkouts + 1;
      updateAfterWorkout(cats, newTotal, stats.lastWorkoutDate, benchPressWeight);
      finishWorkoutStats();

      const records = buildExerciseRecords();
      if (records.length > 0) {
        const dayIndex    = stats.totalWorkouts % 4;
        const day         = PLAN_2ER_SPLIT[dayIndex];
        const totalVolume = records.reduce((a, e) => a + e.volume, 0);
        const totalSets   = records.reduce((a, e) => a + e.sets.length, 0);
        const totalReps   = records.reduce((a, e) =>
          a + e.sets.reduce((b, s) => b + s.reps, 0), 0);
        const durationSec = startTime
          ? Math.floor((Date.now() - startTime) / 1000)
          : 0;

        const workoutInput: WorkoutInput = {
          date: new Date().toISOString().split("T")[0],
          dayLabel: day.label,
          dayTag: day.tag as "PUSH" | "PULL",
          durationSeconds: durationSec,
          totalVolume,
          totalSets,
          totalReps,
          exercises: records as WorkoutInput["exercises"],
        };
        saveWorkout(workoutInput);
      }

      resetWorkout();

      // ── Supabase Sync nach Workout-Ende ─────────────────────
      // Kurz warten damit Zustand-Updates propagiert sind
      setTimeout(async () => {
        const s = useStatsStore.getState();
        const c = useCoachStore.getState();
        const h = useHistoryStore.getState();
        // Nur den neuesten Eintrag + PRs speichern (nicht alle Workouts neu schreiben)
        const latest = h.workouts[h.workouts.length - 1];
        await Promise.all([
          saveStats(s.stats, s.weekDays, s.weeklyGoal),
          saveCoaches(c.selectedCoach, c.coachProgress),
          ...(latest ? [saveWorkoutEntry(latest)] : []),
          savePersonalRecords(h.personalRecords),
        ]);
      }, 300);
    },

    // ── History ──────────────────────────────────────────────────
    getPR,
    getRecentWorkouts,
    getExerciseHistory,

    resetWorkout,
  };
}
