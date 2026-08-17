-- =========================================================
-- Goals & Sub-goals management
-- Run this script once in Supabase SQL Editor.
-- =========================================================

create table if not exists public.goals (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text not null default '',
    budget bigint not null default 0 check (budget >= 0),
    spent bigint not null default 0 check (spent >= 0),
    progress integer not null default 0 check (progress between 0 and 100),
    status text not null default 'planning'
        check (status in ('planning', 'active', 'completed')),
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.sub_goals (
    id uuid primary key default gen_random_uuid(),
    goal_id uuid not null references public.goals(id) on delete cascade,
    title text not null,
    description text not null default '',
    budget bigint not null default 0 check (budget >= 0),
    spent bigint not null default 0 check (spent >= 0),
    progress integer not null default 0 check (progress between 0 and 100),
    completed boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists goals_status_idx
    on public.goals(status);

create index if not exists sub_goals_goal_id_idx
    on public.sub_goals(goal_id);

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists goals_set_updated_at on public.goals;
create trigger goals_set_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

drop trigger if exists sub_goals_set_updated_at on public.sub_goals;
create trigger sub_goals_set_updated_at
before update on public.sub_goals
for each row execute function public.set_updated_at();

-- Admin check without exposing profiles to the browser client.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'admin'
    );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

grant select, insert, update, delete on public.goals to authenticated;
grant select, insert, update, delete on public.sub_goals to authenticated;

alter table public.goals enable row level security;
alter table public.sub_goals enable row level security;

drop policy if exists "admins can manage goals" on public.goals;
create policy "admins can manage goals"
on public.goals
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can manage sub goals" on public.sub_goals;
create policy "admins can manage sub goals"
on public.sub_goals
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Public visitors only need to read goals that are shown on the website.
drop policy if exists "public can read goals" on public.goals;
create policy "public can read goals"
on public.goals
for select
to anon, authenticated
using (true);

drop policy if exists "public can read sub goals" on public.sub_goals;
create policy "public can read sub goals"
on public.sub_goals
for select
to anon, authenticated
using (true);
