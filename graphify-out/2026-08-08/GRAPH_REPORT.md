# Graph Report - Music-Team-Volunteer-Lineup  (2026-08-06)

## Corpus Check
- 43 files · ~13,029 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 221 nodes · 318 edges · 23 communities (12 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74b5a513`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- actions.ts
- Dev Tooling Dependencies
- package.json
- ShareMenu.tsx
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
- volunteers/page.tsx
- include
- app/page.tsx
- SongList.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createClient()` - 10 edges
3. `Modal()` - 7 edges
4. `include` - 7 edges
5. `Home()` - 6 edges
6. `downloadAsImage()` - 6 edges
7. `ensureUpcomingSundays()` - 6 edges
8. `archivePastServices()` - 6 edges
9. `ServicesPage()` - 6 edges
10. `buildShareText()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ServiceDetailPage()` --calls--> `ensureServiceLineupSlots()`  [EXTRACTED]
  src/app/services/[id]/page.tsx → src/lib/actions.ts
- `VolunteersPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/volunteers/page.tsx → src/lib/supabase/server.ts
- `Home()` --calls--> `archivePastServices()`  [EXTRACTED]
  src/app/page.tsx → src/lib/actions.ts
- `Home()` --calls--> `ensureServiceLineupSlots()`  [EXTRACTED]
  src/app/page.tsx → src/lib/actions.ts
- `Home()` --calls--> `ensureUpcomingSundays()`  [EXTRACTED]
  src/app/page.tsx → src/lib/actions.ts

## Import Cycles
- None detected.

## Communities (23 total, 11 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 1 - "actions.ts"
Cohesion: 0.09
Nodes (27): formatDate(), ServiceDetailPage(), AddRoleModal(), INSTRUMENTS, optionClass(), Team, ServiceActionsMenu(), Team (+19 more)

### Community 2 - "Dev Tooling Dependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): next, dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, name (+11 more)

### Community 4 - "ShareMenu.tsx"
Cohesion: 0.17
Nodes (16): anchorName(), assignedName(), Assignment, buildShareText(), downloadAsImage(), DrawLine, LINE_HEIGHT, Playlist (+8 more)

### Community 5 - "ReadOnlyLineupTabs.tsx"
Cohesion: 0.32
Nodes (7): Assignment, displayName(), LEFT_COLUMN_ROLES, ReadOnlyLineupTabs(), Role, Team, Volunteer

### Community 6 - "layout.tsx"
Cohesion: 0.18
Nodes (8): metadata, newsreader, plexMono, NAV_ITEMS, ScrollToTopButton(), choose(), Theme, ThemeToggle()

### Community 7 - "EditSongModal.tsx"
Cohesion: 0.16
Nodes (9): Vocalist, Song, Vocalist, KeyPicker(), KEYS, TimeSignatureInput(), displayName(), Volunteer (+1 more)

### Community 19 - "volunteers/page.tsx"
Cohesion: 0.17
Nodes (10): AddVolunteerModal(), INSTRUMENTS, EditVolunteerModal(), INSTRUMENTS, Volunteer, Modal(), addPlaylist(), addVolunteer() (+2 more)

### Community 20 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 21 - "app/page.tsx"
Cohesion: 0.17
Nodes (16): ArchivePage(), formatDate(), formatDate(), Home(), todayKey(), formatDate(), ServicesPage(), statusFor() (+8 more)

### Community 22 - "SongList.tsx"
Cohesion: 0.33
Nodes (6): displayName(), Song, SongList(), Vocalist, deleteSong(), reorderSongs()

## Knowledge Gaps
- **90 isolated node(s):** `INSTRUMENTS`, `Team`, `Team`, `Role`, `Volunteer` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `createClient()` connect `app/page.tsx` to `actions.ts`, `volunteers/page.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `include`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `INSTRUMENTS`, `Team`, `Team` to the rest of the system?**
  _90 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09047619047619047 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._