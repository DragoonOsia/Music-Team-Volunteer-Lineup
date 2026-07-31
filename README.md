# Worship Team Lineup

A free, self-hosted scheduling tool for a church worship/music team. Built with Next.js and Supabase, deployed on Vercel — no login system, shared with the team via a private link.

## Features

- **Home dashboard** — read-only view of the closest upcoming Sunday's lineup, so anyone can check who's serving without needing edit access.
- **Services** — one entry per Sunday, auto-generated three weeks ahead. Each service has its own setlist and lineup; nothing is shared between weeks.
- **Two teams per service — AM Team and PM Team** — each gets its own independently assignable lineup on every service. Assigning someone to AM Team doesn't affect PM Team, and vice versa.
- **Volunteers** — Name, Nickname, and the instruments/skills they can serve on (checkboxes: Electric Guitar, Acoustic Guitar, Drums, Bass Guitar, Keyboard, Vocals, Musical Director).
- **Role assignment with a built-in safety check** — a searchable dropdown per role (matches on nickname or full name) that automatically hides anyone already booked on a different instrument for that team, so nobody gets double-booked. Vocals and Musical Director are exempt from that check — either can be combined with exactly one instrument.
- **Songs** — Name, Singer/Band, Version, URL reference, musical Key (clickable-free — edited via the Edit button), BPM (with +/- stepper), and Time Signature (defaults to 4/4). Every service always shows at least 3 song slots, empty or filled.
- **Playlists** — attach one or more external playlist links to a service.
- **Archive** — hide a service from the main list without deleting it; archived services live in their own tab and can be restored anytime.
- **Mobile-friendly** — usable on a phone, not just desktop.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- [Supabase](https://supabase.com/) (Postgres + REST API) for the database
- [Tailwind CSS v4](https://tailwindcss.com/) for styling ("Stage Night" dark theme)
- [Vercel](https://vercel.com/) for hosting
- [TypeScript](https://www.typescriptlang.org/)

All free-tier — this project is designed to run at zero cost.

## Getting started (local development)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment example and fill in your Supabase project's values:
   ```bash
   cp .env.local.example .env.local
   ```
   You'll need `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or the newer `sb_publishable_...` key) from your Supabase project's **Settings → API**.
3. Set up the database — open the Supabase SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql). It's idempotent, so re-running it after future schema changes is always safe and won't touch your existing data.
4. Start the dev server:
   ```bash
   npm run dev
   ```
   Then open [http://localhost:3000](http://localhost:3000).

## Deployment

Deployed on [Vercel](https://vercel.com/):

1. Import this repository into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under **Project Settings → Environment Variables**.
3. Deploy. Every subsequent push to the main branch redeploys automatically.

Whenever `supabase/schema.sql` changes, re-run it in the Supabase SQL Editor — the app's code and the database schema are versioned separately.

## Project structure

```
src/
  app/
    page.tsx                 Home - read-only upcoming Sunday lineup
    layout.tsx                Nav + global layout
    services/
      page.tsx                 Services list (closest-first)
      new/page.tsx              Create a service
      [id]/page.tsx             Service detail: songs, playlists, lineup
    volunteers/page.tsx        Volunteer roster
    archive/page.tsx           Archived services
  components/                 Modals, dropdowns, and lineup UI
  lib/
    actions.ts                 All server actions (data mutations)
    supabase/                  Supabase client setup + generated types
supabase/
  schema.sql                   Full database schema (idempotent)
```

## Roles and instruments

Roles are seeded by `schema.sql` and can be edited directly in Supabase's Table Editor: Musical Director, Vocals 1-3, Acoustic Guitar, Electric Guitar, Keyboard, Bass Guitar, Drums. Each role is tied to one of the instrument/skill checkboxes on the Volunteers page, which is what drives eligibility in the assignment dropdowns.

## Knowledge graph

This repo includes [graphify](graphify-out/) — a generated knowledge graph of the codebase (`graphify-out/graph.json`, `GRAPH_REPORT.md`, `graph.html`). It updates automatically on every commit via a git hook, and Claude Code sessions in this repo are configured to consult it before answering codebase questions.
