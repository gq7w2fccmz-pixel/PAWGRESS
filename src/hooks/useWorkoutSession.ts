/**
 * useWorkoutSession
 *
 * Tracks weight + reps per set during an active workout.
 * Collects everything needed to call historyStore.saveWorkout() at the end.
 */
import { useState } from "react";
import type { SetRecord, ExerciseRecord } from "../stores/historyStore";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";

export interface LiveSet {
  weight: number;
  reps: number;
}

export interface LiveExercise {
  name: string;
  sets: LiveSet[];      // grows as sets are completed
}

export function useWorkoutSession(dayIndex: number) {
  const day = PLAN_2ER_SPLIT[dayIndex];
  const [liveExercises, setLiveExercises] = useState<LiveExercise[]>(
    day.exercises.map(e => ({ name: e.name, sets: [] }))
  );

  function recordSet(exIndex: number, weight: number, reps: number) {
    setLiveExercises(prev =>
      prev.map((ex, i) =>
        i === exIndex
          ? { ...ex, sets: [...ex.sets, { weight, reps }] }
          : ex
      )
    );
  }

  function buildExerciseRecords(): Omit<ExerciseRecord, "isPR">[] {
    return liveExercises
      .filter(ex => ex.sets.length > 0)
      .map(ex => {
        const volume = ex.sets.reduce((a, s) => a + s.weight * s.reps, 0);
        const bestSet = ex.sets.reduce((best, s) =>
          s.weight > best.weight ? s : best, ex.sets[0]);
        return { name: ex.name, sets: ex.sets, volume, bestSet };
      });
  }

  return { liveExercises, recordSet, buildExerciseRecords, day };
}
