-- Music Team Volunteer Lineup - schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)

create extension if not exists "pgcrypto";

-- Team members who can be scheduled
create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Positions on the team (Vocals, Guitar, Drums, Keys, Sound, etc.)
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0
);

-- One row per worship service/gathering that needs a lineup
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  service_date date not null,
  title text,
  notes text,
  created_at timestamptz not null default now()
);

-- The lineup itself: which person fills which role for a given service
create table if not exists lineup_assignments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  person_id uuid references people(id) on delete set null,
  unique (service_id, role_id)
);

create index if not exists lineup_assignments_service_id_idx on lineup_assignments(service_id);

-- Starter roles - safe to edit/add more later from the People/Roles page or SQL editor
insert into roles (name, sort_order) values
  ('Worship Leader', 1),
  ('Vocals', 2),
  ('Acoustic Guitar', 3),
  ('Electric Guitar', 4),
  ('Keys', 5),
  ('Bass', 6),
  ('Drums', 7),
  ('Sound', 8)
on conflict (name) do nothing;

-- Row Level Security
-- This app has no login system (personal/team tool shared via a private link).
-- We enable RLS and allow the "anon" key full read/write, since that key is
-- already project-specific and only meant to be given to your team.
-- If you later add real user accounts, tighten these policies.
alter table people enable row level security;
alter table roles enable row level security;
alter table services enable row level security;
alter table lineup_assignments enable row level security;

drop policy if exists "public full access" on people;
create policy "public full access" on people for all using (true) with check (true);

drop policy if exists "public full access" on roles;
create policy "public full access" on roles for all using (true) with check (true);

drop policy if exists "public full access" on services;
create policy "public full access" on services for all using (true) with check (true);

drop policy if exists "public full access" on lineup_assignments;
create policy "public full access" on lineup_assignments for all using (true) with check (true);
