# Graph Report - Music-Team-Volunteer-Lineup  (2026-07-31)

## Corpus Check
- 27 files · ~5,417 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 132 nodes · 170 edges · 20 communities (9 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b8da69d1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TypeScript Compiler Options
- actions.ts
- Dev Tooling Dependencies
- Core Runtime Dependencies
- TypeScript File Globs
- NPM Scripts
- Root Layout & Fonts
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
- teams/page.tsx

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 22 edges
2. `compilerOptions` - 16 edges
3. `include` - 7 edges
4. `scripts` - 5 edges
5. `ensureUpcomingSundays()` - 5 edges
6. `Home()` - 4 edges
7. `ensureTeamRoleSlots()` - 4 edges
8. `updateTeamAssignment()` - 4 edges
9. `lib` - 4 edges
10. `ServiceDetailPage()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `createClient()`  [EXTRACTED]
  src/app/page.tsx → src/lib/supabase/server.ts
- `TeamsPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/teams/page.tsx → src/lib/supabase/server.ts
- `VolunteersPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/volunteers/page.tsx → src/lib/supabase/server.ts
- `ensureUpcomingSundays()` --calls--> `createClient()`  [EXTRACTED]
  src/lib/actions.ts → src/lib/supabase/server.ts
- `ensureTeamRoleSlots()` --calls--> `createClient()`  [EXTRACTED]
  src/lib/actions.ts → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (20 total, 11 thin omitted)

### Community 0 - "TypeScript Compiler Options"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 1 - "actions.ts"
Cohesion: 0.13
Nodes (18): formatDate(), ServiceDetailPage(), VolunteersPage(), INSTRUMENTS, ServiceActionsMenu(), addPlaylist(), addService(), addSong() (+10 more)

### Community 2 - "Dev Tooling Dependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 3 - "Core Runtime Dependencies"
Cohesion: 0.18
Nodes (11): next, dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, react (+3 more)

### Community 4 - "TypeScript File Globs"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 5 - "NPM Scripts"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 6 - "Root Layout & Fonts"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 7 - "server.ts"
Cohesion: 0.33
Nodes (4): formatDate(), Home(), ensureUpcomingSundays(), Database

### Community 19 - "teams/page.tsx"
Cohesion: 0.43
Nodes (5): TeamsPage(), TeamRoleAssignmentRow(), Volunteer, ensureTeamRoleSlots(), updateTeamAssignment()

## Knowledge Gaps
- **60 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `NPM Scripts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `TypeScript Compiler Options` to `TypeScript File Globs`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Core Runtime Dependencies` to `NPM Scripts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Options` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._