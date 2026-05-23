import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";
import type { PlanExercise } from "../data/plan_2er_split";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CustomWorkoutDay {
  id: string;
  label: string;         // "Push A", "Oberkörper", etc.
  exercises: PlanExercise[];
}

export interface CustomPlan {
  id: string;
  name: string;          // "Push Day Plan"
  desc: string;          // "Oberkörper Fokus"
  icon: string;          // emoji
  color: string;
  daysPerWeek: number;
  focus: string;         // "Push · Pull · Core"
  days: CustomWorkoutDay[];
  isActive: boolean;
  createdAt: string;
}

export interface StandaloneWorkout {
  id: string;
  name: string;
  desc: string;
  exercises: PlanExercise[];
  createdAt: string;
}

interface PlanStore {
  plans: CustomPlan[];
  workouts: StandaloneWorkout[];
  activePlanId: string;

  // Plan actions
  createPlan: (plan: Omit<CustomPlan, "id" | "createdAt" | "isActive">) => string;
  updatePlan: (id: string, updates: Partial<CustomPlan>) => void;
  deletePlan: (id: string) => void;
  duplicatePlan: (id: string) => void;
  setActivePlan: (id: string) => void;

  // Workout actions
  createWorkout: (w: Omit<StandaloneWorkout, "id" | "createdAt">) => string;
  updateWorkout: (id: string, updates: Partial<StandaloneWorkout>) => void;
  deleteWorkout: (id: string) => void;

  getActivePlan: () => CustomPlan | undefined;
}

// ── Default built-in plan ─────────────────────────────────────────────────────
const DEFAULT_PLAN_ID = "builtin-2er-split";

const DEFAULT_PLAN: CustomPlan = {
  id: DEFAULT_PLAN_ID,
  name: "2er Split",
  desc: "Push · Pull · 4 Tage/Woche",
  icon: "🏋️",
  color: "#f97316",
  daysPerWeek: 4,
  focus: "Push · Pull · Core",
  isActive: true,
  createdAt: "2024-01-01",
  days: PLAN_2ER_SPLIT.map(d => ({
    id: d.id,
    label: d.label,
    exercises: d.exercises,
  })),
};

// ── Store ─────────────────────────────────────────────────────────────────────
export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      plans: [DEFAULT_PLAN],
      workouts: [],
      activePlanId: DEFAULT_PLAN_ID,

      createPlan: (plan) => {
        const id = `plan-${Date.now()}`;
        set(s => ({ plans: [...s.plans, { ...plan, id, isActive: false, createdAt: new Date().toISOString() }] }));
        return id;
      },

      updatePlan: (id, updates) => {
        set(s => ({ plans: s.plans.map(p => p.id === id ? { ...p, ...updates } : p) }));
      },

      deletePlan: (id) => {
        if (id === DEFAULT_PLAN_ID) return; // protect default
        set(s => ({ plans: s.plans.filter(p => p.id !== id) }));
      },

      duplicatePlan: (id) => {
        const src = get().plans.find(p => p.id === id);
        if (!src) return;
        const newId = `plan-${Date.now()}`;
        set(s => ({ plans: [...s.plans, { ...src, id: newId, name: `${src.name} (Kopie)`, isActive: false, createdAt: new Date().toISOString() }] }));
      },

      setActivePlan: (id) => {
        set(s => ({
          activePlanId: id,
          plans: s.plans.map(p => ({ ...p, isActive: p.id === id })),
        }));
      },

      createWorkout: (w) => {
        const id = `workout-${Date.now()}`;
        set(s => ({ workouts: [...s.workouts, { ...w, id, createdAt: new Date().toISOString() }] }));
        return id;
      },

      updateWorkout: (id, updates) => {
        set(s => ({ workouts: s.workouts.map(w => w.id === id ? { ...w, ...updates } : w) }));
      },

      deleteWorkout: (id) => {
        set(s => ({ workouts: s.workouts.filter(w => w.id !== id) }));
      },

      getActivePlan: () => {
        const { plans, activePlanId } = get();
        return plans.find(p => p.id === activePlanId) ?? plans[0];
      },
    }),
    {
      name: "pawgress-plans",
      partialize: s => ({ plans: s.plans, workouts: s.workouts, activePlanId: s.activePlanId }),
    }
  )
);
