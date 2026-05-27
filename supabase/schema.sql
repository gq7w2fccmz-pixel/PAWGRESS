-- ============================================================
-- Pawgress – Supabase Schema
-- Ausführen in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Bestehende Policies löschen (falls vorhanden)
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

-- ============================================================
-- Tabellen
-- ============================================================

-- 1. user_stats
create table if not exists public.user_stats (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  stats         jsonb not null default '{}',
  week_days     jsonb not null default '[true,true,true,true,true,false,false]',
  weekly_goal   int  not null default 4,
  updated_at    timestamptz not null default now()
);
alter table public.user_stats enable row level security;

-- 2. user_profile
create table if not exists public.user_profile (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  profile     jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);
alter table public.user_profile enable row level security;

-- 3. user_coaches
create table if not exists public.user_coaches (
  user_id         uuid primary key references auth.users(id) on delete cascade,
  selected_coach  text not null default 'Bertl',
  coach_progress  jsonb not null default '{}',
  updated_at      timestamptz not null default now()
);
alter table public.user_coaches enable row level security;

-- 4. user_history
create table if not exists public.user_history (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  workouts          jsonb not null default '[]',
  personal_records  jsonb not null default '{}',
  updated_at        timestamptz not null default now()
);
alter table public.user_history enable row level security;

-- 5. user_plans
create table if not exists public.user_plans (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  plans          jsonb not null default '[]',
  workouts       jsonb not null default '[]',
  active_plan_id text not null default 'builtin-2er-split',
  updated_at     timestamptz not null default now()
);
alter table public.user_plans enable row level security;

-- ============================================================
-- Performance: Indexes
-- ============================================================
create index if not exists idx_user_stats_user   on public.user_stats(user_id);
create index if not exists idx_user_profile_user on public.user_profile(user_id);
create index if not exists idx_user_history_user on public.user_history(user_id);
create index if not exists idx_user_plans_user   on public.user_plans(user_id);
create index if not exists idx_user_coaches_user on public.user_coaches(user_id);

create index if not exists idx_user_history_workouts on public.user_history using gin(workouts);
create index if not exists idx_user_plans_plans      on public.user_plans using gin(plans);

-- ============================================================
-- RLS Policies
-- ============================================================

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

-- user_history
create policy "history_select" on public.user_history for select using (auth.uid() = user_id);
create policy "history_insert" on public.user_history for insert with check (auth.uid() = user_id);
create policy "history_update" on public.user_history for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "history_delete" on public.user_history for delete using (auth.uid() = user_id);

-- user_plans
create policy "plans_select" on public.user_plans for select using (auth.uid() = user_id);
create policy "plans_insert" on public.user_plans for insert with check (auth.uid() = user_id);
create policy "plans_update" on public.user_plans for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "plans_delete" on public.user_plans for delete using (auth.uid() = user_id);

-- ============================================================
-- updated_at Trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create or replace trigger trg_user_stats_updated
  before update on public.user_stats for each row execute procedure public.set_updated_at();
create or replace trigger trg_user_profile_updated
  before update on public.user_profile for each row execute procedure public.set_updated_at();
create or replace trigger trg_user_history_updated
  before update on public.user_history for each row execute procedure public.set_updated_at();
create or replace trigger trg_user_plans_updated
  before update on public.user_plans for each row execute procedure public.set_updated_at();
create or replace trigger trg_user_coaches_updated
  before update on public.user_coaches for each row execute procedure public.set_updated_at();
