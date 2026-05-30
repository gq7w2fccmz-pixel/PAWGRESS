/**
 * pawgress – Supabase Sync Service v3
 *
 * Fixes:
 *  #1  Alle Reads mit explizitem .eq("user_id", uid) gefiltert
 *  #2  flushAllPending() wird in App.tsx bei beforeunload/visibility aufgerufen
 *  #3  Irreführende Variable umbenannt (localIds statt remoteIds)
 *  #5  Fehler in loadHistory() werden geloggt und nicht stillschweigend ignoriert
 *  #6  Fehler in loadPlans() werden geloggt
 *  #7  Supabase-Client wird nur verwendet wenn konfiguriert (isSupabaseConfigured)
 *  #8  Map-Cleanup in debouncedUpsert abgesichert (try/finally)
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import type { Database } from "./database.types";
import { withRetry } from "./retry";
import type { Stats }         from "../stores/statsStore";
import type { CoachProgress } from "../stores/coachStore";
import type { UserProfile }   from "../stores/profileStore";
import type { WorkoutRecord } from "../stores/historyStore";
import type { CustomPlan, StandaloneWorkout } from "../stores/planStore";

// ── Hilfsfunktion: User-ID holen ──────────────────────────────────────────────
async function getUserId(): Promise<string | null> {
  // Fix #7: Keine Netzwerkanfragen wenn Supabase nicht konfiguriert
  if (!isSupabaseConfigured) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ── Debounce-Engine ───────────────────────────────────────────────────────────
const DEBOUNCE_MS = 3_000;
const timers  = new Map<string, ReturnType<typeof setTimeout>>();
const pending = new Map<string, Record<string, unknown>>();

function debouncedUpsert(table: string, data: Record<string, unknown>) {
  pending.set(table, data);
  const existing = timers.get(table);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(async () => {
    // Fix #8: Map-Cleanup in try/finally — kein hängender Eintrag bei Exception
    const payload = pending.get(table);
    try {
      pending.delete(table);
      timers.delete(table);
      if (!payload || !isSupabaseConfigured) return;
      const { error } = await supabase.from(table).upsert(payload);
      if (error) console.error(`[sync] ${table}:`, error.message);
    } catch (e) {
      console.warn(`[sync] debouncedUpsert ${table} fehlgeschlagen:`, e);
    }
  }, DEBOUNCE_MS);
  timers.set(table, timer);
}

// Fix #2: flushAllPending wird bei beforeunload/visibilitychange in App.tsx aufgerufen
export async function flushAllPending() {
  if (!isSupabaseConfigured) return;
  const entries = [...timers.entries()];
  for (const [table, timer] of entries) {
    clearTimeout(timer);
    timers.delete(table);
    const payload = pending.get(table);
    pending.delete(table);
    if (payload) {
      try {
        const { error } = await withRetry(
          async () => supabase.from(table).upsert(payload),
          { attempts: 2, baseDelay: 500 }
        );
        if (error) console.error(`[sync:flush] ${table}:`, error.message);
      } catch (e) {
        console.warn(`[sync:flush] ${table} fehlgeschlagen:`, e);
      }
    }
  }
}

async function upsert(table: string, data: Record<string, unknown>) {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await withRetry(
      async () => supabase.from(table).upsert(data),
      { attempts: 3, baseDelay: 800 }
    );
    if (error) console.error(`[sync] ${table}:`, error.message);
  } catch (e) {
    console.warn(`[sync] upsert ${table} fehlgeschlagen:`, e);
  }
}

// ── STATS ─────────────────────────────────────────────────────────────────────
export async function saveStats(stats: Stats, weekDays: boolean[], weeklyGoal: number) {
  const uid = await getUserId();
  if (!uid) return;
  debouncedUpsert("user_stats", {
    user_id: uid, stats, week_days: weekDays, weekly_goal: weeklyGoal,
    updated_at: new Date().toISOString(),
  });
}

export async function loadStats() {
  const uid = await getUserId();
  if (!uid) return null;
  // Fix #1: Expliziter user_id-Filter auf allen Reads
  const { data, error } = await supabase
    .from("user_stats")
    .select("stats, week_days, weekly_goal")
    .eq("user_id", uid)
    .maybeSingle();
  if (error) { console.error("[sync] loadStats:", error.message); return null; }
  if (!data) return null;
  return {
    stats:      data.stats       as Stats,
    weekDays:   data.week_days   as boolean[],
    weeklyGoal: data.weekly_goal as number,
  };
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
export async function saveProfile(profile: UserProfile) {
  const uid = await getUserId();
  if (!uid) return;
  debouncedUpsert("user_profile", {
    user_id: uid, profile, updated_at: new Date().toISOString(),
  });
}

export async function loadProfile() {
  const uid = await getUserId();
  if (!uid) return null;
  // Fix #1
  const { data, error } = await supabase
    .from("user_profile")
    .select("profile")
    .eq("user_id", uid)
    .maybeSingle();
  if (error) { console.error("[sync] loadProfile:", error.message); return null; }
  return data?.profile as UserProfile | null;
}

// ── COACHES ───────────────────────────────────────────────────────────────────
export async function saveCoaches(selectedCoach: string, coachProgress: CoachProgress) {
  const uid = await getUserId();
  if (!uid) return;
  debouncedUpsert("user_coaches", {
    user_id: uid, selected_coach: selectedCoach, coach_progress: coachProgress,
    updated_at: new Date().toISOString(),
  });
}

export async function loadCoaches() {
  const uid = await getUserId();
  if (!uid) return null;
  // Fix #1
  const { data, error } = await supabase
    .from("user_coaches")
    .select("selected_coach, coach_progress")
    .eq("user_id", uid)
    .maybeSingle();
  if (error) { console.error("[sync] loadCoaches:", error.message); return null; }
  if (!data) return null;
  return {
    selectedCoach: data.selected_coach as string,
    coachProgress: data.coach_progress as CoachProgress,
  };
}

// ── HISTORY ───────────────────────────────────────────────────────────────────
export async function saveWorkoutEntry(workout: WorkoutRecord) {
  const uid = await getUserId();
  if (!uid) return;
  await upsert("workout_entries", {
    id: workout.id, user_id: uid,
    date: workout.date, day_label: workout.dayLabel, day_tag: workout.dayTag,
    plan_id: workout.planId ?? null, is_freestyle: workout.isFreestyle ?? false,
    duration_seconds: workout.durationSeconds, total_volume: workout.totalVolume,
    total_sets: workout.totalSets, total_reps: workout.totalReps,
    exercises: workout.exercises,
  });
}

export async function deleteWorkoutEntry(workoutId: string) {
  const uid = await getUserId();
  if (!uid) return;
  const { error } = await supabase
    .from("workout_entries")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", uid);  // Fix #1: user_id-Filter auch beim Delete
  if (error) console.error("[sync] deleteWorkoutEntry:", error.message);
}

export async function savePersonalRecords(records: Record<string, number>) {
  const uid = await getUserId();
  if (!uid) return;
  debouncedUpsert("user_personal_records", {
    user_id: uid, records, updated_at: new Date().toISOString(),
  });
}

export async function loadHistory() {
  const uid = await getUserId();
  if (!uid) return null;

  // Fix #1 + #5: user_id-Filter + Fehlerbehandlung
  const [entriesRes, prsRes] = await Promise.all([
    supabase
      .from("workout_entries")
      .select("id, date, day_label, day_tag, plan_id, is_freestyle, duration_seconds, total_volume, total_sets, total_reps, exercises")
      .eq("user_id", uid)  // Fix #1
      .order("date", { ascending: false }),
    supabase
      .from("user_personal_records")
      .select("records")
      .eq("user_id", uid)  // Fix #1
      .maybeSingle(),
  ]);

  // Fix #5: Fehler loggen statt stillschweigend ignorieren
  if (entriesRes.error) {
    console.error("[sync] loadHistory (entries):", entriesRes.error.message);
    return null;
  }
  if (prsRes.error) {
    console.error("[sync] loadHistory (PRs):", prsRes.error.message);
  }

  type WERow = Database["public"]["Tables"]["workout_entries"]["Row"];
  const workouts: WorkoutRecord[] = (entriesRes.data ?? []).map((r: WERow) => ({
    id:              r.id,
    date:            r.date,
    dayLabel:        r.day_label,
    dayTag:          r.day_tag,
    planId:          r.plan_id ?? undefined,
    isFreestyle:     r.is_freestyle ?? false,
    durationSeconds: r.duration_seconds,
    totalVolume:     r.total_volume,
    totalSets:       r.total_sets,
    totalReps:       r.total_reps,
    exercises:       r.exercises,
  }));

  return {
    workouts,
    personalRecords: (prsRes.data?.records ?? {}) as Record<string, number>,
  };
}

export async function saveHistory(workouts: WorkoutRecord[], personalRecords: Record<string, number>) {
  await Promise.all([
    ...workouts.map(w => saveWorkoutEntry(w)),
    savePersonalRecords(personalRecords),
  ]);
}

// ── PLANS ─────────────────────────────────────────────────────────────────────
export async function saveCustomPlan(plan: CustomPlan) {
  const uid = await getUserId();
  if (!uid) return;
  await upsert("user_custom_plans", {
    id: plan.id, user_id: uid, name: plan.name, description: plan.desc,
    icon: plan.icon, color: plan.color, days_per_week: plan.daysPerWeek,
    focus: plan.focus, days: plan.days, is_active: plan.isActive,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteCustomPlan(planId: string) {
  const uid = await getUserId();
  if (!uid) return;
  const { error } = await supabase
    .from("user_custom_plans")
    .delete()
    .eq("id", planId)
    .eq("user_id", uid);  // Fix #1
  if (error) console.error("[sync] deleteCustomPlan:", error.message);
}

export async function saveStandaloneWorkout(workout: StandaloneWorkout) {
  const uid = await getUserId();
  if (!uid) return;
  await upsert("user_standalone_workouts", {
    id: workout.id, user_id: uid, name: workout.name,
    description: workout.desc, exercises: workout.exercises,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteStandaloneWorkout(workoutId: string) {
  const uid = await getUserId();
  if (!uid) return;
  const { error } = await supabase
    .from("user_standalone_workouts")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", uid);  // Fix #1
  if (error) console.error("[sync] deleteStandaloneWorkout:", error.message);
}

export async function saveActivePlanId(activePlanId: string) {
  const uid = await getUserId();
  if (!uid) return;
  debouncedUpsert("user_active_plan", {
    user_id: uid, active_plan_id: activePlanId, updated_at: new Date().toISOString(),
  });
}

export async function loadPlans() {
  const uid = await getUserId();
  if (!uid) return null;

  // Fix #1 + #6: user_id-Filter + Fehlerbehandlung
  const [plansRes, workoutsRes, activeRes] = await Promise.all([
    supabase
      .from("user_custom_plans")
      .select("id, name, description, icon, color, days_per_week, focus, days, is_active, created_at")
      .eq("user_id", uid)  // Fix #1
      .order("created_at", { ascending: true }),
    supabase
      .from("user_standalone_workouts")
      .select("id, name, description, exercises, created_at")
      .eq("user_id", uid)  // Fix #1
      .order("created_at", { ascending: true }),
    supabase
      .from("user_active_plan")
      .select("active_plan_id")
      .eq("user_id", uid)  // Fix #1
      .maybeSingle(),
  ]);

  // Fix #6: Fehler loggen
  if (plansRes.error)    console.error("[sync] loadPlans (plans):", plansRes.error.message);
  if (workoutsRes.error) console.error("[sync] loadPlans (workouts):", workoutsRes.error.message);
  if (activeRes.error)   console.error("[sync] loadPlans (active):", activeRes.error.message);

  // Bei kritischem Fehler null zurückgeben statt leere Daten
  if (plansRes.error && workoutsRes.error) return null;

  type CPRow = Database["public"]["Tables"]["user_custom_plans"]["Row"];
  const plans: CustomPlan[] = (plansRes.data ?? []).map((r: CPRow) => ({
    id: r.id, name: r.name, desc: r.description, icon: r.icon, color: r.color,
    daysPerWeek: r.days_per_week, focus: r.focus, days: r.days,
    isActive: r.is_active, createdAt: r.created_at,
  }));

  type SWRow = Database["public"]["Tables"]["user_standalone_workouts"]["Row"];
  const workouts: StandaloneWorkout[] = (workoutsRes.data ?? []).map((r: SWRow) => ({
    id: r.id, name: r.name, desc: r.description, exercises: r.exercises, createdAt: r.created_at,
  }));

  return {
    plans,
    workouts,
    activePlanId: activeRes.data?.active_plan_id ?? "builtin-2er-split",
  };
}

export async function savePlans(plans: CustomPlan[], workouts: StandaloneWorkout[], activePlanId: string) {
  await Promise.all([
    ...plans.map(p => saveCustomPlan(p)),
    ...workouts.map(w => saveStandaloneWorkout(w)),
    saveActivePlanId(activePlanId),
  ]);
}

// ── ALLE DATEN LADEN ──────────────────────────────────────────────────────────
export async function loadAllUserData() {
  const [stats, profile, coaches, history, plans] = await Promise.all([
    loadStats(),
    loadProfile(),
    loadCoaches(),
    loadHistory(),
    loadPlans(),
  ]);
  return { stats, profile, coaches, history, plans };
}
