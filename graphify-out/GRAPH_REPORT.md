# Graph Report - Music-Team-Volunteer-Lineup  (2026-07-31)

## Corpus Check
- 32 files · ~6,559 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 151 nodes · 200 edges · 20 communities (8 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6ac50a95`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Options
- actions.ts
- Dev Tooling Dependencies
- package.json
- TypeScript File Globs
- layout.tsx
- server.ts
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
- EditSongModal.tsx

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 22 edges
2. `compilerOptions` - 16 edges
3. `include` - 7 edges
4. `scripts` - 5 edges
5. `ensureUpcomingSundays()` - 5 edges
6. `Home()` - 4 edges
7. `ServiceDetailPage()` - 4 edges
8. `KeyPicker()` - 4 edges
9. `ensureServiceLineupSlots()` - 4 edges
10. `updateServiceLineupAssignment()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `VolunteersPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/volunteers/page.tsx → src/lib/supabase/server.ts
- `updateServiceLineupAssignment()` --calls--> `createClient()`  [EXTRACTED]
  src/lib/actions.ts → src/lib/supabase/server.ts
- `addSong()` --calls--> `createClient()`  [EXTRACTED]
  src/lib/actions.ts → src/lib/supabase/server.ts
- `updateSong()` --calls--> `createClient()`  [EXTRACTED]
  src/lib/actions.ts → src/lib/supabase/server.ts
- `updateSongKey()` --calls--> `createClient()`  [EXTRACTED]
  src/lib/actions.ts → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (20 total, 12 thin omitted)

### Community 0 - "TypeScript Compiler Options"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 1 - "actions.ts"
Cohesion: 0.14
Nodes (21): formatDate(), Home(), formatDate(), ServiceDetailPage(), VolunteersPage(), INSTRUMENTS, ServiceActionsMenu(), addPlaylist() (+13 more)

### Community 2 - "Dev Tooling Dependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): next, dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, name (+11 more)

### Community 4 - "TypeScript File Globs"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 6 - "layout.tsx"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, GuitarLogo()

### Community 19 - "ServiceLineupTabs.tsx"
Cohesion: 0.22
Nodes (9): Assignment, Role, ServiceLineupTabs(), Team, Volunteer, displayName(), Volunteer, VolunteerCombobox() (+1 more)

### Community 20 - "EditSongModal.tsx"
Cohesion: 0.17
Nodes (6): Song, KeyPicker(), KEYS, addSong(), updateSong(), updateSongKey()

## Knowledge Gaps
- **66 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `package.json`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `TypeScript Compiler Options` to `TypeScript File Globs`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Options` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1350806451612903 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._