# Graph Report - Music-Team-Volunteer-Lineup  (2026-08-05)

## Corpus Check
- 40 files · ~10,043 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 186 nodes · 262 edges · 21 communities (10 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `011e009b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- actions.ts
- Dev Tooling Dependencies
- package.json
- volunteers/page.tsx
- ReadOnlyLineupTabs.tsx
- layout.tsx
- EditSongModal.tsx
- Home / Services List Page
- ESLint Flat Config
- Next.js Config
- PostCSS Config
- Next.js Version Warning (AGENTS.md)
- Boilerplate Icon Asset (file.svg)
- Boilerplate Icon Asset (globe.svg)
- Boilerplate Icon Asset (next.svg)
- Boilerplate Icon Asset (vercel.svg)
- Boilerplate Icon Asset (window.svg)
- Project Description (README)
- ServiceLineupTabs.tsx
- app/page.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createClient()` - 10 edges
3. `include` - 7 edges
4. `Home()` - 6 edges
5. `ensureUpcomingSundays()` - 6 edges
6. `archivePastServices()` - 6 edges
7. `ServicesPage()` - 6 edges
8. `Modal()` - 6 edges
9. `ensureServiceLineupSlots()` - 5 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `VolunteersPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/volunteers/page.tsx → src/lib/supabase/server.ts
- `ServiceDetailPage()` --calls--> `ensureServiceLineupSlots()`  [EXTRACTED]
  src/app/services/[id]/page.tsx → src/lib/actions.ts
- `Home()` --calls--> `archivePastServices()`  [EXTRACTED]
  src/app/page.tsx → src/lib/actions.ts
- `Home()` --calls--> `ensureServiceLineupSlots()`  [EXTRACTED]
  src/app/page.tsx → src/lib/actions.ts
- `Home()` --calls--> `ensureUpcomingSundays()`  [EXTRACTED]
  src/app/page.tsx → src/lib/actions.ts

## Import Cycles
- None detected.

## Communities (21 total, 11 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 1 - "actions.ts"
Cohesion: 0.16
Nodes (12): formatDate(), ServiceDetailPage(), EditPlaylistModal(), addPlaylist(), addService(), archiveService(), deletePlaylist(), deleteService() (+4 more)

### Community 2 - "Dev Tooling Dependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): next, dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, name (+11 more)

### Community 4 - "volunteers/page.tsx"
Cohesion: 0.19
Nodes (11): VolunteersPage(), AddVolunteerModal(), INSTRUMENTS, EditVolunteerModal(), INSTRUMENTS, Volunteer, Modal(), addVolunteer() (+3 more)

### Community 5 - "ReadOnlyLineupTabs.tsx"
Cohesion: 0.33
Nodes (6): Assignment, displayName(), ReadOnlyLineupTabs(), Role, Team, Volunteer

### Community 6 - "layout.tsx"
Cohesion: 0.18
Nodes (8): metadata, newsreader, plexMono, NAV_ITEMS, ScrollToTopButton(), choose(), Theme, ThemeToggle()

### Community 7 - "EditSongModal.tsx"
Cohesion: 0.20
Nodes (7): Song, KeyPicker(), KEYS, TimeSignatureInput(), addSong(), parseTimeSignature(), updateSong()

### Community 19 - "ServiceLineupTabs.tsx"
Cohesion: 0.22
Nodes (9): Assignment, Role, ServiceLineupTabs(), Team, Volunteer, displayName(), Volunteer, VolunteerCombobox() (+1 more)

### Community 21 - "app/page.tsx"
Cohesion: 0.18
Nodes (15): ArchivePage(), formatDate(), formatDate(), Home(), todayKey(), formatDate(), ServicesPage(), statusFor() (+7 more)

## Knowledge Gaps
- **73 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `package.json`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._