/**
 * pawgress – Supabase Sync Service
 *
 * Strategie: On-Demand
 *  • loadAllUserData()  → beim Login / App-Start
 *  • saveXxx()          → nach jeder relevanten Änderung
 *
 * Alle Operationen sind upsert-basiert (kein separates insert/update nötig).
 * localStorage bleibt als Offline-Fallback erhalten (Zustand persist).
 */

import { supabase } from "./supabase";
import type { Stats }         from "../stores/statsStore";
import type { CoachProgress } from "../stores/coachStore";
import type { UserProfile }   from "../stores/profileStore";
import type { WorkoutRecord } from "../stores/historyStore";
import type { CustomPlan, StandaloneWorkout } from "../stores/planStore";

// ── Hilfsfunktion ─────────────────────────────────────────────────────────────
async function upsert(table: string, data: Record<string, unknown>) {
  const { error } = await supabase.from(table).upsert(data);
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
  await upsert("user_stats", {
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
    .single();
  if (error || !data) return null;
  return {
    stats:       data.stats       as Stats,
    weekDays:    data.week_days   as boolean[],
    weeklyGoal:  data.weekly_goal as number,
  };
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
export async function saveProfile(profile: UserProfile) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await upsert("user_profile", {
    user_id: user.id,
    profile,
    updated_at: new Date().toISOString(),
  });
}

export async function loadProfile() {
  const { data, error } = await supabase
    .from("user_profile")
    .select("profile")
    .single();
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
  await upsert("user_coaches", {
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
    .single();
  if (error || !data) return null;
  return {
    selectedCoach:  data.selected_coach  as string,
    coachProgress:  data.coach_progress  as CoachProgress,
  };
}

// ── HISTORY ───────────────────────────────────────────────────────────────────
export async function saveHistory(
  workouts: WorkoutRecord[],
  personalRecords: Record<string, number>,
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await upsert("user_history", {
    user_id: user.id,
    workouts,
    personal_records: personalRecords,
    updated_at: new Date().toISOString(),
  });
}

export async function loadHistory() {
  const { data, error } = await supabase
    .from("user_history")
    .select("workouts, personal_records")
    .single();
  if (error || !data) return null;
  return {
    workouts:        data.workouts         as WorkoutRecord[],
    personalRecords: data.personal_records as Record<string, number>,
  };
}

// ── PLANS ─────────────────────────────────────────────────────────────────────
export async function savePlans(
  plans: CustomPlan[],
  workouts: StandaloneWorkout[],
  activePlanId: string,
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await upsert("user_plans", {
    user_id: user.id,
    plans,
    workouts,
    active_plan_id: activePlanId,
    updated_at: new Date().toISOString(),
  });
}

export async function loadPlans() {
  const { data, error } = await supabase
    .from("user_plans")
    .select("plans, workouts, active_plan_id")
    .single();
  if (error || !data) return null;
  return {
    plans:        data.plans          as CustomPlan[],
    workouts:     data.workouts       as StandaloneWorkout[],
    activePlanId: data.active_plan_id as string,
  };
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
