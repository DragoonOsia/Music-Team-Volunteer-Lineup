# Graph Report - Music-Team-Volunteer-Lineup  (2026-08-05)

## Corpus Check
- 41 files · ~10,350 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 190 nodes · 266 edges · 22 communities (11 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ebfe9914`
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
- include
- createClient

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createClient()` - 11 edges
3. `Home()` - 7 edges
4. `include` - 7 edges
5. `ensureUpcomingSundays()` - 6 edges
6. `archivePastServices()` - 6 edges
7. `ServicesPage()` - 6 edges
8. `Modal()` - 6 edges
9. `ensureServiceLineupSlots()` - 5 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `VolunteersPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/volunteers/page.tsx → src/lib/supabase/server.ts
- `Home()` --calls--> `ensureServiceLineupSlots()`  [EXTRACTED]
  src/app/page.tsx → src/lib/actions.ts
- `ServiceDetailPage()` --calls--> `ensureServiceLineupSlots()`  [EXTRACTED]
  src/app/services/[id]/page.tsx → src/lib/actions.ts
- `Home()` --calls--> `ensureUpcomingSundays()`  [EXTRACTED]
  src/app/page.tsx → src/lib/actions.ts
- `ServicesPage()` --calls--> `ensureUpcomingSundays()`  [EXTRACTED]
  src/app/services/page.tsx → src/lib/actions.ts

## Import Cycles
- None detected.

## Communities (22 total, 11 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 1 - "actions.ts"
Cohesion: 0.15
Nodes (13): formatDate(), ServiceDetailPage(), Song, addPlaylist(), addService(), archiveService(), deletePlaylist(), deleteService() (+5 more)

### Community 2 - "Dev Tooling Dependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): next, dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, name (+11 more)

### Community 4 - "volunteers/page.tsx"
Cohesion: 0.16
Nodes (12): VolunteersPage(), AddVolunteerModal(), INSTRUMENTS, EditVolunteerModal(), INSTRUMENTS, Volunteer, Modal(), addVolunteer() (+4 more)

### Community 5 - "ReadOnlyLineupTabs.tsx"
Cohesion: 0.33
Nodes (6): Assignment, displayName(), ReadOnlyLineupTabs(), Role, Team, Volunteer

### Community 6 - "layout.tsx"
Cohesion: 0.18
Nodes (8): metadata, newsreader, plexMono, NAV_ITEMS, ScrollToTopButton(), choose(), Theme, ThemeToggle()

### Community 7 - "EditSongModal.tsx"
Cohesion: 0.18
Nodes (7): Song, KeyPicker(), KEYS, TimeSignatureInput(), addSong(), parseTimeSignature(), updateSong()

### Community 19 - "ServiceLineupTabs.tsx"
Cohesion: 0.22
Nodes (9): Assignment, Role, ServiceLineupTabs(), Team, Volunteer, displayName(), Volunteer, VolunteerCombobox() (+1 more)

### Community 20 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 21 - "createClient"
Cohesion: 0.19
Nodes (14): ArchivePage(), formatDate(), formatDate(), Home(), todayKey(), formatDate(), ServicesPage(), statusFor() (+6 more)

## Knowledge Gaps
- **74 isolated node(s):** `Song`, `eslintConfig`, `nextConfig`, `name`, `version` (+69 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `package.json`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `include`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `Song`, `eslintConfig`, `nextConfig` to the rest of the system?**
  _74 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14624505928853754 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._