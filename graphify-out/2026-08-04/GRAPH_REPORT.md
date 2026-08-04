# Graph Report - Music-Team-Volunteer-Lineup  (2026-08-03)

## Corpus Check
- 39 files · ~125,774 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 265 nodes · 410 edges · 23 communities (11 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f16fb441`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- actions.ts
- Dev Tooling Dependencies
- package.json
- support.js
- ReadOnlyLineupTabs.tsx
- layout.tsx
- client.ts
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
- Handoff: "Hymnal" theme for Worship Team Lineup

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 27 edges
2. `compilerOptions` - 16 edges
3. `Handoff: "Hymnal" theme for Worship Team Lineup` - 13 edges
4. `Screens / views` - 11 edges
5. `walk()` - 9 edges
6. `walkXImport()` - 9 edges
7. `walkElement()` - 9 edges
8. `createRuntime()` - 9 edges
9. `getReact()` - 8 edges
10. `boot()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `boot()` --references--> `react-dom`  [EXTRACTED]
  design_handoff_hymnal_theme/support.js → package.json
- `createComponentFactory()` --references--> `react`  [EXTRACTED]
  design_handoff_hymnal_theme/support.js → package.json
- `VolunteersPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/volunteers/page.tsx → src/lib/supabase/server.ts
- `ArchivePage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/archive/page.tsx → src/lib/supabase/server.ts
- `Home()` --calls--> `ensureServiceLineupSlots()`  [EXTRACTED]
  src/app/page.tsx → src/lib/actions.ts

## Import Cycles
- None detected.

## Communities (23 total, 12 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 1 - "actions.ts"
Cohesion: 0.10
Nodes (33): ArchivePage(), formatDate(), formatDate(), Home(), todayKey(), formatDate(), ServiceDetailPage(), formatDate() (+25 more)

### Community 2 - "Dev Tooling Dependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (20): createComponentFactory(), next, dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js (+12 more)

### Community 4 - "support.js"
Cohesion: 0.07
Nodes (51): boot(), cdnScriptFor(), collectProps(), compileAttr(), compileTemplate(), contentKey(), createExternalModules(), createHelmetManager() (+43 more)

### Community 5 - "ReadOnlyLineupTabs.tsx"
Cohesion: 0.33
Nodes (6): Assignment, displayName(), ReadOnlyLineupTabs(), Role, Team, Volunteer

### Community 6 - "layout.tsx"
Cohesion: 0.20
Nodes (7): metadata, newsreader, plexMono, NAV_ITEMS, choose(), Theme, ThemeToggle()

### Community 19 - "ServiceLineupTabs.tsx"
Cohesion: 0.25
Nodes (7): Assignment, Role, Team, Volunteer, displayName(), Volunteer, VolunteerCombobox()

### Community 20 - "EditSongModal.tsx"
Cohesion: 0.26
Nodes (4): Song, KeyPicker(), KEYS, TimeSignatureInput()

### Community 21 - "Handoff: "Hymnal" theme for Worship Team Lineup"
Cohesion: 0.07
Nodes (26): 10. Print / share band sheet — NEW, 1. Today — desktop (`src/app/page.tsx`), 2. Today — mobile (390px), 3. Service detail (`src/app/services/[id]/page.tsx`), 4. Services (`src/app/services/page.tsx`), 5. Volunteers (`src/app/volunteers/page.tsx`), 6. Archive (`src/app/archive/page.tsx`), 7. New service (`src/app/services/new/page.tsx`) (+18 more)

## Knowledge Gaps
- **95 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `boot()` connect `support.js` to `package.json`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10175763182238667 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._