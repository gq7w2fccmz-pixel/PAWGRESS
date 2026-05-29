/**
 * pawgress – Supabase Sync Service v2
 *
 * Strategie: Normalisierte Tabellen – eine Row pro Datensatz
 *  • loadAllUserData()  → beim Login / App-Start
 *  • saveXxx()          → nach jeder relevanten Änderung
 *
 * Tabellen:
 *  user_stats, user_profile, user_coaches  → JSONB (klein, selten)
 *  workout_entries                          → eine Row pro Workout
 *  user_personal_records                    → JSONB (wächst langsam)
 *  user_custom_plans                        → eine Row pro Plan
 *  user_standalone_workouts                 → eine Row pro Workout-Template
 *  user_active_plan                         → aktiver Plan-ID
 */

import { supabase } from "./supabase";
import { withRetry } from "./retry";
import type { Stats }         from "../stores/statsStore";
import type { CoachProgress } from "../stores/coachStore";
import type { UserProfile }   from "../stores/profileStore";
import type { WorkoutRecord } from "../stores/historyStore";
import type { CustomPlan, StandaloneWorkout } from "../stores/planStore";

// ── Debounce-Engine ───────────────────────────────────────────────────────────
// Einzelne Tabellen (user_stats, user_profile etc.) werden gedebounced.
// workout_entries und user_custom_plans werden DIREKT geschrieben (keine JSONB-Arrays).
const DEBOUNCE_MS = 3_000;
const timers  = new Map<string, ReturnType<typeof setTimeout>>();
const pending = new Map<string, Record<string, unknown>>();

function debouncedUpsert(table: string, data: Record<string, unknown>) {
  pending.set(table, data);
  const existing = timers.get(table);
  if (existing) clearTimeout(existing);
  const timer = setTimeout(async () => {
    const payload = pending.get(table);
    if (!payload) return;
    pending.delete(table);
    timers.delete(table);
    const { error } = await supabase.from(table).upsert(payload);
    if (error) console.error(`[sync] ${table}:`, error.message);
  }, DEBOUNCE_MS);
  timers.set(table, timer);
}

export async function flushAllPending() {
  for (const [table, timer] of timers.entries()) {
    clearTimeout(timer);
    timers.delete(table);
    const payload = pending.get(table);
    pending.delete(table);
    if (payload) {
      const { error } = await withRetry(
        async () => supabase.from(table).upsert(payload),
        { attempts: 2, baseDelay: 500 }
      );
      if (error) console.error(`[sync:flush] ${table}:`, error.message);
    }
  }
}

async function upsert(table: string, data: Record<string, unknown>) {
  const { error } = await withRetry(
    async () => supabase.from(table).upsert(data),
    { attempts: 3, baseDelay: 800 }
  );
  if (error) console.error(`[sync] ${table}:`, error.message);
}

// ── STATS ─────────────────────────────────────────────────────────────────────
export async function saveStats(
  stats: Stats,
  weekDays: boolean[],
  weeklyGoal: number,
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  debouncedUpsert("user_stats", {
    user_id: user.id,
    stats,
    week_days: weekDays,
    weekly_goal: weeklyGoal,
    updated_at: new Date().toISOString(),
  });
}

export async function loadStats() {
  const { data, error } = await supabase
    .from("user_stats")
    .select("stats, week_days, weekly_goal")
    .maybeSingle();
  if (error || !data) return null;
  return {
    stats:      data.stats       as Stats,
    weekDays:   data.week_days   as boolean[],
    weeklyGoal: data.weekly_goal as number,
  };
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
export async function saveProfile(profile: UserProfile) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  debouncedUpsert("user_profile", {
    user_id: user.id,
    profile,
    updated_at: new Date().toISOString(),
  });
}

export async function loadProfile() {
  const { data, error } = await supabase
    .from("user_profile")
    .select("profile")
    .maybeSingle();
  if (error || !data) return null;
  return data.profile as UserProfile;
}

// ── COACHES ───────────────────────────────────────────────────────────────────
export async function saveCoaches(
  selectedCoach: string,
  coachProgress: CoachProgress,
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  debouncedUpsert("user_coaches", {
    user_id: user.id,
    selected_coach: selectedCoach,
    coach_progress: coachProgress,
    updated_at: new Date().toISOString(),
  });
}

export async function loadCoaches() {
  const { data, error } = await supabase
    .from("user_coaches")
    .select("selected_coach, coach_progress")
    .maybeSingle();
  if (error || !data) return null;
  return {
    selectedCoach: data.selected_coach as string,
    coachProgress: data.coach_progress as CoachProgress,
  };
}

// ── HISTORY: normalisiert (eine Row pro Workout) ───────────────────────────────
export async function saveWorkoutEntry(workout: WorkoutRecord) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await upsert("workout_entries", {
    id:               workout.id,
    user_id:          user.id,
    date:             workout.date,
    day_label:        workout.dayLabel,
    day_tag:          workout.dayTag,
    duration_seconds: workout.durationSeconds,
    total_volume:     workout.totalVolume,
    total_sets:       workout.totalSets,
    total_reps:       workout.totalReps,
    exercises:        workout.exercises,
  });
}

export async function deleteWorkoutEntry(workoutId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase
    .from("workout_entries")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", user.id);
  if (error) console.error("[sync] deleteWorkoutEntry:", error.message);
}

export async function savePersonalRecords(records: Record<string, number>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  debouncedUpsert("user_personal_records", {
    user_id:    user.id,
    records,
    updated_at: new Date().toISOString(),
  });
}

export async function loadHistory() {
  const [entriesRes, prsRes] = await Promise.all([
    supabase
      .from("workout_entries")
      .select("id, date, day_label, day_tag, duration_seconds, total_volume, total_sets, total_reps, exercises")
      .order("date", { ascending: false }),
    supabase
      .from("user_personal_records")
      .select("records")
      .maybeSingle(),
  ]);

  const workouts: WorkoutRecord[] = (entriesRes.data ?? []).map(r => ({
    id:              r.id,
    date:            r.date,
    dayLabel:        r.day_label,
    dayTag:          r.day_tag,
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

// Compat: saveHistory schreibt jetzt jeden Eintrag einzeln
export async function saveHistory(
  workouts: WorkoutRecord[],
  personalRecords: Record<string, number>,
) {
  await Promise.all([
    ...workouts.map(w => saveWorkoutEntry(w)),
    savePersonalRecords(personalRecords),
  ]);
}

// ── PLANS: normalisiert (eine Row pro Plan / Workout-Template) ─────────────────
export async function saveCustomPlan(plan: CustomPlan) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await upsert("user_custom_plans", {
    id:           plan.id,
    user_id:      user.id,
    name:         plan.name,
    description:  plan.desc,
    icon:         plan.icon,
    color:        plan.color,
    days_per_week: plan.daysPerWeek,
    focus:        plan.focus,
    days:         plan.days,
    is_active:    plan.isActive,
    updated_at:   new Date().toISOString(),
  });
}

export async function deleteCustomPlan(planId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase
    .from("user_custom_plans")
    .delete()
    .eq("id", planId)
    .eq("user_id", user.id);
  if (error) console.error("[sync] deleteCustomPlan:", error.message);
}

export async function saveStandaloneWorkout(workout: StandaloneWorkout) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await upsert("user_standalone_workouts", {
    id:          workout.id,
    user_id:     user.id,
    name:        workout.name,
    description: workout.desc,
    exercises:   workout.exercises,
    updated_at:  new Date().toISOString(),
  });
}

export async function deleteStandaloneWorkout(workoutId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase
    .from("user_standalone_workouts")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", user.id);
  if (error) console.error("[sync] deleteStandaloneWorkout:", error.message);
}

export async function saveActivePlanId(activePlanId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  debouncedUpsert("user_active_plan", {
    user_id:        user.id,
    active_plan_id: activePlanId,
    updated_at:     new Date().toISOString(),
  });
}

export async function loadPlans() {
  const [plansRes, workoutsRes, activeRes] = await Promise.all([
    supabase
      .from("user_custom_plans")
      .select("id, name, description, icon, color, days_per_week, focus, days, is_active, created_at")
      .order("created_at", { ascending: true }),
    supabase
      .from("user_standalone_workouts")
      .select("id, name, description, exercises, created_at")
      .order("created_at", { ascending: true }),
    supabase
      .from("user_active_plan")
      .select("active_plan_id")
      .maybeSingle(),
  ]);

  const plans: CustomPlan[] = (plansRes.data ?? []).map(r => ({
    id:          r.id,
    name:        r.name,
    desc:        r.description,
    icon:        r.icon,
    color:       r.color,
    daysPerWeek: r.days_per_week,
    focus:       r.focus,
    days:        r.days,
    isActive:    r.is_active,
    createdAt:   r.created_at,
  }));

  const workouts: StandaloneWorkout[] = (workoutsRes.data ?? []).map(r => ({
    id:        r.id,
    name:      r.name,
    desc:      r.description,
    exercises: r.exercises,
    createdAt: r.created_at,
  }));

  return {
    plans,
    workouts,
    activePlanId: activeRes.data?.active_plan_id ?? "builtin-2er-split",
  };
}

// Compat: savePlans schreibt jeden Plan und jedes Workout einzeln
export async function savePlans(
  plans: CustomPlan[],
  workouts: StandaloneWorkout[],
  activePlanId: string,
) {
  await Promise.all([
    ...plans.map(p => saveCustomPlan(p)),
    ...workouts.map(w => saveStandaloneWorkout(w)),
    saveActivePlanId(activePlanId),
  ]);
}

// ── ALLE DATEN LADEN (beim Login) ─────────────────────────────────────────────
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
