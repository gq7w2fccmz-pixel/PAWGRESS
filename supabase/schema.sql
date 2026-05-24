-- ============================================================
-- Pawgress – Supabase Schema
-- Ausführen in: Supabase Dashboard → SQL Editor
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
create policy "Own stats" on public.user_stats
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2. user_profile
create table if not exists public.user_profile (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  profile     jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);
alter table public.user_profile enable row level security;
create policy "Own profile" on public.user_profile
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. user_coaches
create table if not exists public.user_coaches (
  user_id         uuid primary key references auth.users(id) on delete cascade,
  selected_coach  text not null default 'Bertl',
  coach_progress  jsonb not null default '{}',
  updated_at      timestamptz not null default now()
);
alter table public.user_coaches enable row level security;
create policy "Own coaches" on public.user_coaches
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. user_history
create table if not exists public.user_history (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  workouts          jsonb not null default '[]',
  personal_records  jsonb not null default '{}',
  updated_at        timestamptz not null default now()
);
alter table public.user_history enable row level security;
create policy "Own history" on public.user_history
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. user_plans
create table if not exists public.user_plans (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  plans          jsonb not null default '[]',
  workouts       jsonb not null default '[]',
  active_plan_id text not null default 'builtin-2er-split',
  updated_at     timestamptz not null default now()
);
alter table public.user_plans enable row level security;
create policy "Own plans" on public.user_plans
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
