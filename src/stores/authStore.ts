/**
 * useAuthStore – E-Mail + Passwort Auth
 * Robust: alle Supabase-Calls haben Timeouts, App hängt nie
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Session } from "@supabase/supabase-js";
import { supabase }        from "../lib/supabase";
import { toast }           from "../lib/toast";
import { loadAllUserData } from "../lib/syncService";
import { useStatsStore }   from "./statsStore";
import { useProfileStore } from "./profileStore";
import { useCoachStore }   from "./coachStore";
import type { CoachProgress } from "./coachStore";
import { useHistoryStore } from "./historyStore";
import { usePlanStore }    from "./planStore";

// Hilfsfunktion: Promise mit Timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout nach ${ms}ms`)), ms)
    ),
  ]);
}

// Streak-Verfall Check
function checkStreakExpiry(progress: CoachProgress, lastWorkoutDate: string | null): CoachProgress {
  if (!lastWorkoutDate || progress.currentStreak === 0) return progress;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];
  if (lastWorkoutDate === today || lastWorkoutDate === yStr) return progress;
  return { ...progress, currentStreak: 0 };
}

// Daten von Supabase laden – mit Timeout, nie hängen
async function syncFromSupabase() {
  // Guard: don't overwrite local data if we've already synced recently
  // Uses useAuthStore.getState() since this function lives outside the create() scope
  const now = Date.now();
  const lastSync = useAuthStore.getState().lastSyncedAt ?? 0;
  const localAge = now - lastSync;
  // If synced within last 5 seconds AND not first-time load, skip
  if (localAge < 5000 && lastSync > 0) return;

  // Atomic: check AND set syncing in one operation to prevent race conditions
  if (useAuthStore.getState().syncing) return;
  useAuthStore.setState({ syncing: true });

  try {
    const result = await withTimeout(loadAllUserData(), 5000);
    const { stats, profile, coaches, history, plans } = result;

    if (stats) {
      useStatsStore.setState({
        stats:      stats.stats,
        weekDays:   stats.weekDays,
        weeklyGoal: stats.weeklyGoal,
      });
    }
    if (profile)  useProfileStore.setState({ profile });
    if (coaches) {
      const lastWorkoutDate = stats?.stats.lastWorkoutDate ?? null;
      const coachProgress   = checkStreakExpiry(coaches.coachProgress, lastWorkoutDate);
      useCoachStore.setState({ selectedCoach: coaches.selectedCoach, coachProgress });
    }
    if (history) useHistoryStore.setState({
      workouts:        history.workouts,
      personalRecords: history.personalRecords,
    });
    if (plans) usePlanStore.setState({
      plans:        plans.plans,
      workouts:     plans.workouts,
      activePlanId: plans.activePlanId,
    });
  } catch (e) {
    console.warn("[auth] syncFromSupabase fehlgeschlagen (lokale Daten werden verwendet):", e);
    // Don't toast on sync failure - app works offline
  } finally {
    useAuthStore.setState({ syncing: false, lastSyncedAt: Date.now() });
  }
}

interface AuthStore {
  user:            User | null;
  session:         Session | null;
  loading:         boolean;
  syncing:         boolean;
  lastSyncedAt:    number;
  authError:       string | null;
  needsOnboarding: boolean;

  signIn:             (email: string, password: string) => Promise<void>;
  signUp:             (email: string, password: string) => Promise<void>;
  resetPassword:      (email: string) => Promise<void>;
  logout:             () => Promise<void>;
  clearError:         () => void;
  completeOnboarding: (data: { name: string; dob: string; gender: string; avatarImg: string }) => Promise<void>;
  initAuth:           () => () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:            null,
      session:         null,
      loading:         true,
      syncing:         false,
      lastSyncedAt:    0,
      authError:       null,
      needsOnboarding: false,

      clearError: () => set({ authError: null }),

      signIn: async (email, password) => {
        set({ authError: null });
        try {
          const { error } = await withTimeout(
            supabase.auth.signInWithPassword({ email, password }), 8000
          );
          if (error) set({ authError:
            error.message === "Invalid login credentials"
              ? "E-Mail oder Passwort falsch."
              : error.message
          });
        } catch (e) {
          set({ authError: "Verbindungsfehler. Bitte nochmal versuchen." });
          toast.error("Verbindungsfehler. Prüfe deine Internetverbindung.");
        }
      },

      signUp: async (email, password) => {
        set({ authError: null });
        try {
          const { error } = await withTimeout(
            supabase.auth.signUp({ email, password }), 8000
          );
          if (error) {
            set({ authError:
              error.message === "User already registered"
                ? "Diese E-Mail ist bereits registriert."
                : error.message
            });
          } else {
            set({ needsOnboarding: true });
          }
        } catch (e) {
          set({ authError: "Verbindungsfehler. Bitte nochmal versuchen." });
          toast.error("Verbindungsfehler. Prüfe deine Internetverbindung.");
        }
      },

      resetPassword: async (email) => {
        set({ authError: null });
        try {
          const { error } = await withTimeout(
            supabase.auth.resetPasswordForEmail(email, {
              redirectTo: window.location.origin,
            }), 8000
          );
          if (error) set({ authError: error.message });
        } catch (e) {
          set({ authError: "Verbindungsfehler." });
        }
      },

      logout: async () => {
        try {
          await withTimeout(supabase.auth.signOut(), 3000);
        } catch (e) {
          console.warn("[auth] signOut fehlgeschlagen:", e);
        }
        set({ user: null, session: null, needsOnboarding: false, lastSyncedAt: 0 });
      },

      completeOnboarding: async (_data) => {
        // Sofort abschließen – kein Warten auf Supabase
        set({ needsOnboarding: false });
      },

      initAuth: () => {
        // Session prüfen mit Timeout
        withTimeout(supabase.auth.getSession(), 5000)
          .then(async ({ data: { session } }) => {
            set({ session, user: session?.user ?? null, loading: false });
            if (session?.user) {
              await syncFromSupabase();
              set({ lastSyncedAt: Date.now() });
            }
          })
          .catch((e) => {
            console.warn("[auth] getSession fehlgeschlagen:", e);
            // Offline oder Timeout → App trotzdem starten
            set({ loading: false, syncing: false });
          });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            set({ session, user: session?.user ?? null, loading: false });
            if (session?.user) {
              await syncFromSupabase();
              set({ lastSyncedAt: Date.now() });
            }
          }
        );

        return () => subscription.unsubscribe();
      },
    }),
    {
      name: "pawgress-auth",
      partialize: (s) => ({ needsOnboarding: s.needsOnboarding, lastSyncedAt: s.lastSyncedAt }),
    }
  )
);
