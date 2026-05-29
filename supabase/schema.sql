-- ============================================================
-- Pawgress – Supabase Schema v2
-- Normalisierte Struktur: keine JSONB-Arrays mehr für wachsende Daten
-- Ausführen in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Alte Policies löschen ────────────────────────────────────────────────────
drop policy if exists "Own stats"    on public.user_stats;
drop policy if exists "Own profile"  on public.user_profile;
drop policy if exists "Own coaches"  on public.user_coaches;
drop policy if exists "Own history"  on public.user_history;
drop policy if exists "Own plans"    on public.user_plans;

drop policy if exists "stats_select"   on public.user_stats;
drop policy if exists "stats_insert"   on public.user_stats;
drop policy if exists "stats_update"   on public.user_stats;
drop policy if exists "stats_delete"   on public.user_stats;

drop policy if exists "profile_select" on public.user_profile;
drop policy if exists "profile_insert" on public.user_profile;
drop policy if exists "profile_update" on public.user_profile;
drop policy if exists "profile_delete" on public.user_profile;

drop policy if exists "coaches_select" on public.user_coaches;
drop policy if exists "coaches_insert" on public.user_coaches;
drop policy if exists "coaches_update" on public.user_coaches;
drop policy if exists "coaches_delete" on public.user_coaches;

drop policy if exists "history_select" on public.user_history;
drop policy if exists "history_insert" on public.user_history;
drop policy if exists "history_update" on public.user_history;
drop policy if exists "history_delete" on public.user_history;

drop policy if exists "plans_select"   on public.user_plans;
drop policy if exists "plans_insert"   on public.user_plans;
drop policy if exists "plans_update"   on public.user_plans;
drop policy if exists "plans_delete"   on public.user_plans;

drop policy if exists "entries_select" on public.workout_entries;
drop policy if exists "entries_insert" on public.workout_entries;
drop policy if exists "entries_update" on public.workout_entries;
drop policy if exists "entries_delete" on public.workout_entries;

drop policy if exists "custom_plans_select" on public.user_custom_plans;
drop policy if exists "custom_plans_insert" on public.user_custom_plans;
drop policy if exists "custom_plans_update" on public.user_custom_plans;
drop policy if exists "custom_plans_delete" on public.user_custom_plans;

drop policy if exists "standalone_select" on public.user_standalone_workouts;
drop policy if exists "standalone_insert" on public.user_standalone_workouts;
drop policy if exists "standalone_update" on public.user_standalone_workouts;
drop policy if exists "standalone_delete" on public.user_standalone_workouts;

-- ── Tabellen ─────────────────────────────────────────────────────────────────

-- 1. user_stats (klein, bleibt als JSONB – ändert sich selten)
create table if not exists public.user_stats (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  stats         jsonb not null default '{}',
  week_days     jsonb not null default '[true,true,true,true,true,false,false]',
  weekly_goal   int  not null default 4,
  updated_at    timestamptz not null default now()
);
alter table public.user_stats enable row level security;

-- 2. user_profile (klein, bleibt als JSONB)
create table if not exists public.user_profile (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  profile     jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);
alter table public.user_profile enable row level security;

-- 3. user_coaches (klein, bleibt als JSONB)
create table if not exists public.user_coaches (
  user_id         uuid primary key references auth.users(id) on delete cascade,
  selected_coach  text not null default 'Bertl',
  coach_progress  jsonb not null default '{}',
  updated_at      timestamptz not null default now()
);
alter table public.user_coaches enable row level security;

-- 4. workout_entries (NEU: eine Row pro Workout statt JSONB-Array)
--    Ersetzt: user_history.workouts
create table if not exists public.workout_entries (
  id               text        not null,               -- ISO timestamp / uuid
  user_id          uuid        not null references auth.users(id) on delete cascade,
  date             date        not null,
  day_label        text        not null default '',
  day_tag          text        not null default 'PUSH',
  duration_seconds int         not null default 0,
  total_volume     float       not null default 0,
  total_sets       int         not null default 0,
  total_reps       int         not null default 0,
  exercises        jsonb       not null default '[]',  -- ExerciseRecord[] bleibt JSONB (max ~10 Übungen)
  created_at       timestamptz not null default now(),
  primary key (id, user_id)
);
alter table public.workout_entries enable row level security;

-- 5. user_personal_records (NEU: getrennt von workout_entries)
create table if not exists public.user_personal_records (
  user_id  uuid    primary key references auth.users(id) on delete cascade,
  records  jsonb   not null default '{}',              -- { "Bankdrücken": 100, ... } – wächst langsam
  updated_at timestamptz not null default now()
);
alter table public.user_personal_records enable row level security;

-- 6. user_custom_plans (NEU: eine Row pro Plan statt JSONB-Array)
--    Ersetzt: user_plans.plans
create table if not exists public.user_custom_plans (
  id           text        not null,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  name         text        not null default '',
  description  text        not null default '',
  icon         text        not null default '💪',
  color        text        not null default '#e8a050',
  days_per_week int        not null default 3,
  focus        text        not null default '',
  days         jsonb       not null default '[]',      -- CustomWorkoutDay[] – Struktur, nicht Verlauf
  is_active    boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (id, user_id)
);
alter table public.user_custom_plans enable row level security;

-- 7. user_standalone_workouts (NEU: eine Row pro Workout statt JSONB-Array)
--    Ersetzt: user_plans.workouts
create table if not exists public.user_standalone_workouts (
  id          text        not null,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null default '',
  description text        not null default '',
  exercises   jsonb       not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (id, user_id)
);
alter table public.user_standalone_workouts enable row level security;

-- 8. user_active_plan (NEU: active_plan_id getrennt gespeichert)
create table if not exists public.user_active_plan (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  active_plan_id text not null default 'builtin-2er-split',
  updated_at     timestamptz not null default now()
);
alter table public.user_active_plan enable row level security;

-- ── Alte Tabellen entfernen (nur falls noch vorhanden) ────────────────────────
drop table if exists public.user_history;
drop table if exists public.user_plans;

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists idx_stats_user       on public.user_stats(user_id);
create index if not exists idx_profile_user     on public.user_profile(user_id);
create index if not exists idx_coaches_user     on public.user_coaches(user_id);
create index if not exists idx_entries_user     on public.workout_entries(user_id);
create index if not exists idx_entries_date     on public.workout_entries(user_id, date desc);
create index if not exists idx_prs_user         on public.user_personal_records(user_id);
create index if not exists idx_plans_user       on public.user_custom_plans(user_id);
create index if not exists idx_plans_active     on public.user_custom_plans(user_id, is_active);
create index if not exists idx_standalone_user  on public.user_standalone_workouts(user_id);
create index if not exists idx_active_plan_user on public.user_active_plan(user_id);

-- ── RLS Policies ─────────────────────────────────────────────────────────────

-- user_stats
create policy "stats_select" on public.user_stats for select using (auth.uid() = user_id);
create policy "stats_insert" on public.user_stats for insert with check (auth.uid() = user_id);
create policy "stats_update" on public.user_stats for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "stats_delete" on public.user_stats for delete using (auth.uid() = user_id);

-- user_profile
create policy "profile_select" on public.user_profile for select using (auth.uid() = user_id);
create policy "profile_insert" on public.user_profile for insert with check (auth.uid() = user_id);
create policy "profile_update" on public.user_profile for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profile_delete" on public.user_profile for delete using (auth.uid() = user_id);

-- user_coaches
create policy "coaches_select" on public.user_coaches for select using (auth.uid() = user_id);
create policy "coaches_insert" on public.user_coaches for insert with check (auth.uid() = user_id);
create policy "coaches_update" on public.user_coaches for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "coaches_delete" on public.user_coaches for delete using (auth.uid() = user_id);

-- workout_entries
create policy "entries_select" on public.workout_entries for select using (auth.uid() = user_id);
create policy "entries_insert" on public.workout_entries for insert with check (auth.uid() = user_id);
create policy "entries_update" on public.workout_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "entries_delete" on public.workout_entries for delete using (auth.uid() = user_id);

-- user_personal_records
create policy "prs_select" on public.user_personal_records for select using (auth.uid() = user_id);
create policy "prs_insert" on public.user_personal_records for insert with check (auth.uid() = user_id);
create policy "prs_update" on public.user_personal_records for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "prs_delete" on public.user_personal_records for delete using (auth.uid() = user_id);

-- user_custom_plans
create policy "custom_plans_select" on public.user_custom_plans for select using (auth.uid() = user_id);
create policy "custom_plans_insert" on public.user_custom_plans for insert with check (auth.uid() = user_id);
create policy "custom_plans_update" on public.user_custom_plans for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "custom_plans_delete" on public.user_custom_plans for delete using (auth.uid() = user_id);

-- user_standalone_workouts
create policy "standalone_select" on public.user_standalone_workouts for select using (auth.uid() = user_id);
create policy "standalone_insert" on public.user_standalone_workouts for insert with check (auth.uid() = user_id);
create policy "standalone_update" on public.user_standalone_workouts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "standalone_delete" on public.user_standalone_workouts for delete using (auth.uid() = user_id);

-- user_active_plan
create policy "active_plan_select" on public.user_active_plan for select using (auth.uid() = user_id);
create policy "active_plan_insert" on public.user_active_plan for insert with check (auth.uid() = user_id);
create policy "active_plan_update" on public.user_active_plan for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "active_plan_delete" on public.user_active_plan for delete using (auth.uid() = user_id);

-- ── updated_at Trigger ────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create or replace trigger trg_stats_updated
  before update on public.user_stats for each row execute procedure public.set_updated_at();
create or replace trigger trg_profile_updated
  before update on public.user_profile for each row execute procedure public.set_updated_at();
create or replace trigger trg_coaches_updated
  before update on public.user_coaches for each row execute procedure public.set_updated_at();
create or replace trigger trg_prs_updated
  before update on public.user_personal_records for each row execute procedure public.set_updated_at();
create or replace trigger trg_plans_updated
  before update on public.user_custom_plans for each row execute procedure public.set_updated_at();
create or replace trigger trg_standalone_updated
  before update on public.user_standalone_workouts for each row execute procedure public.set_updated_at();
create or replace trigger trg_active_plan_updated
  before update on public.user_active_plan for each row execute procedure public.set_updated_at();
