-- Music Team Volunteer Lineup - schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- Safe to re-run: every statement is idempotent and won't drop existing volunteer data.

create extension if not exists "pgcrypto";

-- Just the two tab labels shown on a service - not a standing roster.
-- Who fills each role is decided fresh per service (see service_lineup_assignments).
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0
);
alter table teams drop column if exists session;

-- Volunteers who can be scheduled
alter table if exists people rename to volunteers;
create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);
alter table volunteers add column if not exists nickname text;
alter table volunteers add column if not exists instruments text[] not null default '{}';
alter table volunteers drop column if exists team_id;

-- Positions a team needs filled, each tied to one instrument/skill
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0
);
alter table roles add column if not exists instrument text;
update roles set name = 'Keyboard', instrument = 'Keyboard' where name = 'Keys';
update roles set name = 'Bass Guitar', instrument = 'Bass Guitar' where name = 'Bass';
update roles set instrument = 'Vocals' where name in ('Vocals 1', 'Vocals 2', 'Vocals 3');
update roles set instrument = 'Acoustic Guitar' where name = 'Acoustic Guitar';
update roles set instrument = 'Electric Guitar' where name = 'Electric Guitar';
update roles set instrument = 'Drums' where name = 'Drums';

-- One row per Sunday service (no more AM/PM split at the service level)
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  service_date date not null,
  title text,
  notes text,
  created_at timestamptz not null default now()
);
alter table services drop column if exists session;
alter table services drop constraint if exists services_session_check;
alter table services drop column if exists team_id;
drop index if exists services_date_session_idx;
alter table services add column if not exists archived boolean not null default false;

-- The old fixed-roster design is replaced by service_lineup_assignments below
drop table if exists lineup_assignments;
drop table if exists team_role_assignments;

-- Who fills each role, for each of the two tabs (AM Team / PM Team), on THIS
-- specific service. Nothing here carries over to the next service.
create table if not exists service_lineup_assignments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  person_id uuid references volunteers(id) on delete set null,
  unique (service_id, team_id, role_id)
);
create index if not exists service_lineup_assignments_service_id_idx on service_lineup_assignments(service_id);

-- Setlist for a service
create table if not exists songs (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  name text not null,
  singer_or_band text,
  version text,
  url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table songs add column if not exists key text;
alter table songs add column if not exists alt_key text;
alter table songs add column if not exists bpm integer;
alter table songs add column if not exists time_signature_numerator integer not null default 4;
alter table songs add column if not exists time_signature_denominator integer not null default 4;
create index if not exists songs_service_id_idx on songs(service_id);

-- Playlist links for a service
create table if not exists playlists (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);
create index if not exists playlists_service_id_idx on playlists(service_id);

-- Starter teams (tab labels only) - rename freely from the SQL editor
update teams set name = 'AM Team' where name = 'Team A';
update teams set name = 'PM Team' where name = 'Team B';
insert into teams (name, sort_order) values
  ('AM Team', 1),
  ('PM Team', 2)
on conflict (name) do nothing;

-- Starter roles - safe to edit/add more later from the SQL editor
insert into roles (name, instrument, sort_order) values
  ('Musical Director', 'Musical Director', 0),
  ('Vocals 1', 'Vocals', 1),
  ('Vocals 2', 'Vocals', 2),
  ('Vocals 3', 'Vocals', 3),
  ('Acoustic Guitar', 'Acoustic Guitar', 4),
  ('Electric Guitar', 'Electric Guitar', 5),
  ('Keyboard', 'Keyboard', 6),
  ('Bass Guitar', 'Bass Guitar', 7),
  ('Drums', 'Drums', 8)
on conflict (name) do nothing;

-- Row Level Security
-- This app has no login system (personal/team tool shared via a private link).
-- We enable RLS and allow the "anon" key full read/write, since that key is
-- already project-specific and only meant to be given to your team.
-- If you later add real user accounts, tighten these policies.
alter table teams enable row level security;
alter table volunteers enable row level security;
alter table roles enable row level security;
alter table services enable row level security;
alter table service_lineup_assignments enable row level security;
alter table songs enable row level security;
alter table playlists enable row level security;

drop policy if exists "public full access" on teams;
create policy "public full access" on teams for all using (true) with check (true);

drop policy if exists "public full access" on volunteers;
create policy "public full access" on volunteers for all using (true) with check (true);

drop policy if exists "public full access" on roles;
create policy "public full access" on roles for all using (true) with check (true);

drop policy if exists "public full access" on services;
create policy "public full access" on services for all using (true) with check (true);

drop policy if exists "public full access" on service_lineup_assignments;
create policy "public full access" on service_lineup_assignments for all using (true) with check (true);

drop policy if exists "public full access" on songs;
create policy "public full access" on songs for all using (true) with check (true);

drop policy if exists "public full access" on playlists;
create policy "public full access" on playlists for all using (true) with check (true);
