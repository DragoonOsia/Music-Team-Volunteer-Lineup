# Worship Team Lineup

A free, self-hosted scheduling tool for a church worship/music team. Built with Next.js and Supabase, deployed on Vercel — no login system, shared with the team via a private link.

## Features

- **Lineup (home)** — read-only view of the closest upcoming Sunday: its setlist, playlist link, and the AM/PM lineups, so anyone can check who's serving without needing edit access.
- **Services** — one entry per Sunday, auto-generated three weeks ahead. Each service has its own setlist and lineup; nothing is shared between weeks. A status column shows at a glance whether each service is **Fully Set**, has **N Roles Open**, **Needs Setlist**, or is **Not Started**.
- **Two teams per service — AM Team and PM Team** — each gets its own independently assignable lineup on every service. Assigning someone to AM Team doesn't affect PM Team, and vice versa.
- **Volunteers** — Name, Nickname, and the instruments/skills they can serve on (checkboxes: Electric Guitar, Acoustic Guitar, Drums, Bass Guitar, Keyboard, Vocals, Musical Director). Each volunteer can be edited or removed.
- **Role assignment with a built-in safety check** — a searchable dropdown per role (matches on nickname or full name) that automatically hides anyone already booked on a different instrument for that team, so nobody gets double-booked. Vocals and Musical Director are exempt from that check — either can be combined with exactly one instrument.
- **Add Role** — from a service's **Actions** menu, add another role for an instrument and scope it to one team. The first extra role for a previously-singular instrument renumbers the original (e.g. `Drums` becomes `Drums 1` and the new one is `Drums 2`); Vocals is already numbered, so it just takes the next number. Roles added this way only appear on the team they were created for.
- **Songs** — Name, Singer/Band, Version, URL reference, Key, optional **Alternate Key** (the key picked for one can't be picked for the other), **Anchor** (the lead vocal for that song, chosen from whoever is assigned to a Vocals role on the service), BPM (stepper, defaults to 120), and Time Signature (defaults to 4/4). Songs can be reordered by dragging the handle on each row.
- **Playlists** — attach an external playlist link to a service; shown as a button on both the service and the Lineup page.
- **Share** — from a service's **Share** menu, copy the whole service as text or download it as an image. Either can be scoped to all teams or just one. The text version pastes the playlist as a clickable link in rich-text apps and as a full URL everywhere else.
- **Archive** — hide a service from the main list without deleting it; archived services live in their own tab and can be restored anytime. Services whose date has passed are archived automatically.
- **Day / Night theme** — follows your device's light/dark setting automatically, and can be overridden with the toggle in the nav.
- **Mobile-friendly** — usable on a phone, not just desktop, with a floating scroll-to-top button on long pages.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- [Supabase](https://supabase.com/) (Postgres + REST API) for the database
- [Tailwind CSS v4](https://tailwindcss.com/) for styling ("Hymnal" theme — Newsreader + IBM Plex Mono, with Day/Night modes)
- [Vercel](https://vercel.com/) for hosting
- [TypeScript](https://www.typescriptlang.org/)
- [Claude Code](https://claude.com/claude-code) (Anthropic) — the app was designed, built, and is maintained with it, paired with [graphify](graphify-out/) for codebase context

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

A shorter free `*.vercel.app` alias can be added under **Project Settings → Domains** — no payment or custom domain needed. The original URL keeps working alongside it.

Whenever `supabase/schema.sql` changes, re-run it in the Supabase SQL Editor — the app's code and the database schema are versioned separately.

## Project structure

```
src/
  app/
    page.tsx                 Lineup - read-only upcoming Sunday (setlist + lineup)
    layout.tsx                Nav, fonts, theme init, scroll-to-top
    services/
      page.tsx                 Services list with status column
      new/page.tsx              Create a service
      [id]/page.tsx             Service detail: songs, playlists, lineup
    volunteers/page.tsx        Volunteer roster
    archive/page.tsx           Archived services
  components/                 Modals, dropdowns, and lineup UI
  lib/
    actions.ts                 All server actions (data mutations)
    supabase/                  Supabase client setup + hand-maintained types
supabase/
  schema.sql                   Full database schema (idempotent)
```

## Roles and instruments

Roles are seeded by `schema.sql`: Musical Director, Vocals 1-3, Acoustic Guitar, Electric Guitar, Keyboard, Bass Guitar, Drums. Each role is tied to one of the instrument/skill checkboxes on the Volunteers page, which is what drives eligibility in the assignment dropdowns.

A role's `team_id` controls where it shows up: `null` (the seeded default) means it appears on every team, while a role created through **Add Role** is scoped to the single team it was made for. Roles can also still be edited directly in Supabase's Table Editor.

## Database schema notes

`supabase/schema.sql` is the single source of truth and is safe to re-run. Because `src/lib/supabase/types.ts` is maintained by hand rather than generated, any new column has to be added in both places — otherwise the build fails type-checking.

## Knowledge graph

This repo includes [graphify](graphify-out/) — a generated knowledge graph of the codebase (`graphify-out/graph.json`, `GRAPH_REPORT.md`, `graph.html`). It updates automatically on every commit via a git hook, and Claude Code sessions in this repo are configured to consult it before answering codebase questions.
