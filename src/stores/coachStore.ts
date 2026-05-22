import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ────────────────────────────────────────────────────────────────────
export interface CoachProgress {
  // Workout counters by muscle group
  workoutsWithKraft: number;
  workoutsWithCardio: number;
  workoutsWithStretch: number;
  workoutsWithCore: number;
  workoutsWithRuecken: number;
  workoutsWithBeine: number;
  workoutsWithBrust: number;
  workoutsWithSchultern: number;
  workoutsWithArme: number;
  // Ben: at least once flags
  hasKraft: boolean;
  hasCardio: boolean;
  hasStretch: boolean;
  // Bärli: streak tracking
  currentStreak: number;
  maxStreak: number;
  // Willi: bench press progression
  benchPressWeightHistory: number[];
  benchPressProgressions: number;
  // Unlocked coaches
  unlockedCoaches: string[];
}

interface CoachStore {
  selectedCoach: string;
  coachProgress: CoachProgress;
  setCoach: (name: string) => void;
  isCoachUnlocked: (name: string) => boolean;
  getCoachProgress: (name: string) => { current: number; max: number };
  updateAfterWorkout: (cats: ReturnType<typeof categorizeExercises>, totalWorkouts: number, lastWorkoutDate: string | null, benchPressWeight?: number) => void;
}

// ── Exercise categorizer ─────────────────────────────────────────────────────
export function categorizeExercises(patterns: string[]) {
  const p = patterns.map(c => c.toLowerCase());
  return {
    hasKraft:     p.some(c => ["horizontal_push","vertical_push","horizontal_pull","vertical_pull","squat","hip_hinge","elbow_flexion","elbow_extension"].includes(c)),
    hasCardio:    p.some(c => ["cardio","conditioning","plantar_flexion"].includes(c)),
    hasStretch:   p.some(c => ["stretch","spinal_extension","scapular_upward_rotation"].includes(c)),
    hasCore:      p.some(c => ["trunk_flexion","anti_extension","rotation","lateral_flexion","hip_flexion"].includes(c)),
    hasBrust:     p.some(c => c.includes("horizontal_push") || c.includes("decline_push") || c.includes("incline_push")),
    hasRuecken:   p.some(c => ["horizontal_pull","vertical_pull","shoulder_extension","hip_hinge"].includes(c)),
    hasBeine:     p.some(c => ["squat","lunge","lateral_lunge","knee_extension","hip_abduction","hip_adduction","hip_extension","knee_flexion"].includes(c)),
    hasSchultern: p.some(c => ["vertical_push","shoulder_abduction","shoulder_flexion","horizontal_abduction","scapula_elevation"].includes(c)),
    hasArme:      p.some(c => ["elbow_flexion","elbow_extension","wrist_flexion","wrist_extension"].includes(c)),
  };
}

// ── Unlock rules ─────────────────────────────────────────────────────────────
function computeUnlocked(p: CoachProgress, totalWorkouts: number): Set<string> {
  const u = new Set(p.unlockedCoaches);
  if (totalWorkouts >= 1)                              u.add("Pam");
  if (p.currentStreak >= 2)                            u.add("Bärli");
  if (p.hasKraft && p.hasCardio && p.hasStretch)       u.add("Ben");
  if (totalWorkouts >= 20)                             u.add("Otto");
  if (p.workoutsWithKraft >= 10)                       u.add("Trude");
  if (p.workoutsWithCardio >= 10)                      u.add("Fredl");
  if (p.workoutsWithStretch >= 10)                     u.add("Mia");
  if (p.benchPressProgressions >= 4)                   u.add("Willi");
  if (totalWorkouts >= 40)                             u.add("Wolfi");
  if (p.workoutsWithArme >= 50)                        u.add("Tim");
  if (p.workoutsWithCore >= 50)                        u.add("Leon");
  if (p.workoutsWithRuecken >= 50)                     u.add("Toro");
  if (p.workoutsWithBeine >= 50)                       u.add("Olli");
  if (p.workoutsWithBrust >= 50)                       u.add("Rocko");
  if (p.workoutsWithSchultern >= 50)                   u.add("Rhino");
  if (p.workoutsWithCardio >= 50)                      u.add("Leya");
  if (p.workoutsWithStretch >= 50)                     u.add("Sen");
  return u;
}

const DEFAULT: CoachProgress = {
  workoutsWithKraft: 0, workoutsWithCardio: 0, workoutsWithStretch: 0,
  workoutsWithCore: 0, workoutsWithRuecken: 0, workoutsWithBeine: 0,
  workoutsWithBrust: 0, workoutsWithSchultern: 0, workoutsWithArme: 0,
  hasKraft: false, hasCardio: false, hasStretch: false,
  currentStreak: 0, maxStreak: 0,
  benchPressWeightHistory: [], benchPressProgressions: 0,
  unlockedCoaches: ["Bertl", "Lilly"],
};

export const useCoachStore = create<CoachStore>()(
  persist(
    (set, get) => ({
      selectedCoach: "Bertl",
      coachProgress: DEFAULT,

      setCoach: (name) => set({ selectedCoach: name }),

      isCoachUnlocked: (name) => get().coachProgress.unlockedCoaches.includes(name),

      getCoachProgress: (name) => {
        const p = get().coachProgress;
        // totalWorkouts read from statsStore at call site – passed as closure isn't ideal,
        // so we store a mirror here for the progress map:
        const t = p.unlockedCoaches.length; // placeholder – see usePawgressStore bridge
        const map: Record<string, { current: number; max: number }> = {
          Pam:   { current: Math.min(p.workoutsWithKraft + p.workoutsWithCardio > 0 ? 1 : 0, 1), max: 1 },
          Bärli: { current: Math.min(p.currentStreak, 2),  max: 2  },
          Ben:   { current: [p.hasKraft, p.hasCardio, p.hasStretch].filter(Boolean).length, max: 3 },
          Trude: { current: Math.min(p.workoutsWithKraft, 10),    max: 10 },
          Fredl: { current: Math.min(p.workoutsWithCardio, 10),   max: 10 },
          Mia:   { current: Math.min(p.workoutsWithStretch, 10),  max: 10 },
          Willi: { current: Math.min(p.benchPressProgressions, 4), max: 4 },
          Tim:   { current: Math.min(p.workoutsWithArme, 50),     max: 50 },
          Leon:  { current: Math.min(p.workoutsWithCore, 50),     max: 50 },
          Toro:  { current: Math.min(p.workoutsWithRuecken, 50),  max: 50 },
          Olli:  { current: Math.min(p.workoutsWithBeine, 50),    max: 50 },
          Rocko: { current: Math.min(p.workoutsWithBrust, 50),    max: 50 },
          Rhino: { current: Math.min(p.workoutsWithSchultern, 50), max: 50 },
          Leya:  { current: Math.min(p.workoutsWithCardio, 50),   max: 50 },
          Sen:   { current: Math.min(p.workoutsWithStretch, 50),  max: 50 },
        };
        return map[name] ?? { current: 0, max: 1 };
      },

      updateAfterWorkout: (cats, totalWorkouts, lastWorkoutDate, benchPressWeight) => {
        const { coachProgress: p } = get();
        const today = new Date().toISOString().split("T")[0];

        // Bench press progression
        let { benchPressWeightHistory, benchPressProgressions } = p;
        if (benchPressWeight !== undefined && benchPressWeight > 0) {
          const last = benchPressWeightHistory[benchPressWeightHistory.length - 1] ?? 0;
          if (benchPressWeight > last) benchPressProgressions++;
          benchPressWeightHistory = [...benchPressWeightHistory, benchPressWeight];
        }

        // Streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split("T")[0];
        let newStreak = p.currentStreak;
        if (lastWorkoutDate === yStr)      newStreak = p.currentStreak + 1;
        else if (lastWorkoutDate !== today) newStreak = 1;
        const newMaxStreak = Math.max(newStreak, p.maxStreak);

        const updated: CoachProgress = {
          ...p,
          workoutsWithKraft:     p.workoutsWithKraft     + (cats.hasKraft     ? 1 : 0),
          workoutsWithCardio:    p.workoutsWithCardio    + (cats.hasCardio    ? 1 : 0),
          workoutsWithStretch:   p.workoutsWithStretch   + (cats.hasStretch   ? 1 : 0),
          workoutsWithCore:      p.workoutsWithCore      + (cats.hasCore      ? 1 : 0),
          workoutsWithRuecken:   p.workoutsWithRuecken   + (cats.hasRuecken   ? 1 : 0),
          workoutsWithBeine:     p.workoutsWithBeine     + (cats.hasBeine     ? 1 : 0),
          workoutsWithBrust:     p.workoutsWithBrust     + (cats.hasBrust     ? 1 : 0),
          workoutsWithSchultern: p.workoutsWithSchultern + (cats.hasSchultern ? 1 : 0),
          workoutsWithArme:      p.workoutsWithArme      + (cats.hasArme      ? 1 : 0),
          hasKraft:   p.hasKraft  || cats.hasKraft,
          hasCardio:  p.hasCardio || cats.hasCardio,
          hasStretch: p.hasStretch || cats.hasStretch,
          benchPressWeightHistory,
          benchPressProgressions,
          currentStreak: newStreak,
          maxStreak: newMaxStreak,
          unlockedCoaches: Array.from(computeUnlocked({ ...p, currentStreak: newStreak }, totalWorkouts)),
        };
        set({ coachProgress: updated });
      },
    }),
    {
      name: "pawgress-coaches",
      partialize: (s) => ({ selectedCoach: s.selectedCoach, coachProgress: s.coachProgress }),
    }
  )
);
