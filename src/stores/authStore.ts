/**
 * useAuthStore – verwaltet den Supabase Auth-State
 *
 * Zuständig für:
 *  • Login via Magic Link
 *  • Logout
 *  • Session-Wiederherstellung beim App-Start
 *  • Trigger für loadAllUserData nach erfolgreichem Login
 */

import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { supabase }           from "../lib/supabase";
import { loadAllUserData }    from "../lib/syncService";
import { useStatsStore }      from "./statsStore";
import { useProfileStore }    from "./profileStore";
import { useCoachStore }      from "./coachStore";
import type { CoachProgress } from "./coachStore";
import { useHistoryStore }    from "./historyStore";
import { usePlanStore }       from "./planStore";

// ── Streak-Verfall beim App-Start (Bug #3) ────────────────────────────────────
// Prüft ob der Streak seit dem letzten Workout-Tag verfallen ist.
// Wird einmalig nach dem Laden der Daten aus Supabase aufgerufen.
function checkStreakExpiry(
  progress: CoachProgress,
  lastWorkoutDate: string | null,
): CoachProgress {
  if (!lastWorkoutDate || progress.currentStreak === 0) return progress;

  const today     = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];

  // Streak ist noch gültig wenn letztes Training heute oder gestern war
  const streakAlive = lastWorkoutDate === today || lastWorkoutDate === yStr;
  if (streakAlive) return progress;

  // Streak verfallen → auf 0 zurücksetzen
  return { ...progress, currentStreak: 0 };
}

interface AuthStore {
  user:        User | null;
  session:     Session | null;
  loading:     boolean;
  syncing:     boolean;
  authError:   string | null;

  sendMagicLink:  (email: string) => Promise<void>;
  logout:         () => Promise<void>;
  initAuth:       () => () => void;
}

async function syncFromSupabase() {
  try {
    const { stats, profile, coaches, history, plans } = await loadAllUserData();

    if (stats) {
      useStatsStore.setState({
        stats:      stats.stats,
        weekDays:   stats.weekDays,
        weeklyGoal: stats.weeklyGoal,
      });
    }
    if (profile)  useProfileStore.setState({ profile });
    if (coaches) {
      // ── Bug #3: Streak-Verfall beim App-Start prüfen ─────────────────────
      const lastWorkoutDate = stats?.stats.lastWorkoutDate ?? null;
      const coachProgress   = checkStreakExpiry(coaches.coachProgress, lastWorkoutDate);
      useCoachStore.setState({
        selectedCoach: coaches.selectedCoach,
        coachProgress,
      });
    }
    if (history)  useHistoryStore.setState({
      workouts:        history.workouts,
      personalRecords: history.personalRecords,
    });
    if (plans)    usePlanStore.setState({
      plans:        plans.plans,
      workouts:     plans.workouts,
      activePlanId: plans.activePlanId,
    });
  } catch (e) {
    console.error("[auth] Sync fehlgeschlagen:", e);
  }
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user:      null,
  session:   null,
  loading:   true,
  syncing:   false,
  authError: null,

  sendMagicLink: async (email: string) => {
    set({ authError: null });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) set({ authError: error.message });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  initAuth: () => {
    // Beim App-Start: vorhandene Session prüfen
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      set({ session, user: session?.user ?? null, loading: false });
      if (session?.user) {
        set({ syncing: true });
        await syncFromSupabase();
        set({ syncing: false });
      }
    });

    // Auth-State Listener (Login via Magic Link, Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        set({ session, user: session?.user ?? null, loading: false });
        if (session?.user) {
          set({ syncing: true });
          await syncFromSupabase();
          set({ syncing: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  },
}));
