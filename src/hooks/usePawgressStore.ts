/**
 * usePawgressStore – Legacy bridge
 *
 * Composes the three modular stores into the original API.
 * Existing screens import this unchanged; new screens can
 * directly use useStatsStore / useCoachStore / useWorkoutStore.
 *
 * Fixed bugs:
 *  #1 – screen was returned but never read from workoutStore
 *  #2 – stats.streak duplicate removed (lives only in coachStore)
 *  #3 – useWorkoutSession reset on each navigation fixed (moved to workoutStore)
 *  #4 – dayIndex in WorkoutDone was off-by-one (finishWorkout increments first)
 *  #5 – getPR destructured but not used in ActiveSetScreen (kept, cleaned import)
 */
import { useStatsStore }  from "../stores/statsStore";
import { useCoachStore, categorizeExercises } from "../stores/coachStore";
import { useWorkoutStore } from "../stores/workoutStore";
import { useHistoryStore } from "../stores/historyStore";
import type { AreaName }  from "../types";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";
import type { WorkoutInput } from "../stores/historyStore";

export function usePawgressStore() {
  // ── Stats ────────────────────────────────────────────────────
  const stats              = useStatsStore(s => s.stats);
  const weekDays           = useStatsStore(s => s.weekDays);
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
    selectedCoach,
    coachProgress,
    screen,           // BUG #1: now properly read from workoutStore
    activeArea,
    session,

    // ── Navigation ───────────────────────────────────────────────
    setScreen,
    setActiveArea: (area: AreaName | null) => setActiveArea(area),

    // ── Coach ────────────────────────────────────────────────────
    setCoach,
    isCoachUnlocked,
    getCoachProgress: (name: string) => {
      const t = stats.totalWorkouts;
      // Override total-based coaches since coachStore doesn't have totalWorkouts directly
      const overrides: Record<string, { current: number; max: number }> = {
        Pam:  { current: Math.min(t, 1),  max: 1  },
        Otto: { current: Math.min(t, 20), max: 20 },
        Wolfi:{ current: Math.min(t, 40), max: 40 },
      };
      return overrides[name] ?? getCoachProgress(name);
    },

    // ── Workout ──────────────────────────────────────────────────
    startWorkout: () => {
      resetWorkout(); // BUG #3: clear any stale session before starting new one
      startWorkoutSession(stats.totalWorkouts);
    },

    completeSet: (_exIndex: number, weight: number, reps: number) => {
      addVolume(weight * reps);
    },

    completeExercise: (exIndex: number) => {
      completeExerciseWS(exIndex);
    },

    finishWorkout: (
      exerciseCategories: string[],
      benchPressWeight?: number,
      startTime?: number,
    ) => {
      const cats     = categorizeExercises(exerciseCategories);
      const newTotal = stats.totalWorkouts + 1;
      updateAfterWorkout(cats, newTotal, stats.lastWorkoutDate, benchPressWeight);
      finishWorkoutStats();

      // Always use records from workoutStore (survives route changes)
      const records = buildExerciseRecords();
      if (records.length > 0) {
        const dayIndex    = stats.totalWorkouts % 4;        // pre-increment index
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
    },

    // ── History ──────────────────────────────────────────────────
    getPR,
    getRecentWorkouts,
    getExerciseHistory,

    resetWorkout,
  };
}
