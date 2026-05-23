/**
 * Pawgress Store – Modular Architecture
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  useStatsStore   – totalWorkouts, volume, streak, weekDays  │
 * │  useCoachStore   – selectedCoach, unlock progress, PRs       │
 * │  useWorkoutStore – active session, screen, activeArea        │
 * └─────────────────────────────────────────────────────────────┘
 *
 * usePawgressStore  – legacy bridge: imports all three,
 *                     exposes the old API so existing screens
 *                     keep working without changes.
 */

export { useStatsStore }   from "./statsStore";
export { useCoachStore, categorizeExercises } from "./coachStore";
export { useWorkoutStore }  from "./workoutStore";
export type { Stats }       from "./statsStore";
export type { CoachProgress } from "./coachStore";
export { useHistoryStore } from "./historyStore";
export type { WorkoutRecord, ExerciseRecord, SetRecord } from "./historyStore";
export type { WorkoutSession, LiveExerciseLog } from "./workoutStore";
export { usePlanStore } from "./planStore";
export type { CustomPlan, StandaloneWorkout, CustomWorkoutDay } from "./planStore";
export { useProfileStore } from "./profileStore";
export type { UserProfile } from "./profileStore";
