/**
 * Berechnet den nächsten Trainingstag eines Plans.
 *
 * Fix #1 + #4: Verwendet planWorkoutCount (nur Workouts DIESES Plans)
 * statt totalWorkouts (alle Workouts jemals).
 *
 * Fix #8: Sicher gegen leere Plans (days.length === 0).
 */
import type { CustomPlan, CustomWorkoutDay } from "../stores/planStore";
import type { WorkoutRecord } from "../stores/historyStore";

/** Zählt wie viele Workouts für einen bestimmten Plan gespeichert sind. */
export function countPlanWorkouts(
  workouts: WorkoutRecord[],
  planId: string,
): number {
  return workouts.filter(w => w.planId === planId).length;
}

/** Gibt den nächsten Tag eines Plans zurück — sicher gegen leere Plans. */
export function getNextPlanDay(
  plan: CustomPlan,
  planWorkoutCount: number,
): CustomWorkoutDay | null {
  // Fix #8: Schutz gegen leere Plans
  if (!plan.days || plan.days.length === 0) return null;
  const idx = planWorkoutCount % plan.days.length;
  return plan.days[idx];
}
