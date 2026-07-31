# Graph Report - .  (2026-07-31)

## Corpus Check
- Corpus is ~2,644 words - fits in a single context window. You may not need a graph.

## Summary
- 109 nodes · 121 edges · 19 communities (7 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 41,789 input · 0 output

## Community Hubs (Navigation)
- TypeScript Compiler Options
- Lineup App Pages & Server Actions
- Dev Tooling Dependencies
- Core Runtime Dependencies
- TypeScript File Globs
- NPM Scripts
- Root Layout & Fonts
- Supabase Client Setup
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createClient()` - 13 edges
3. `include` - 7 edges
4. `scripts` - 5 edges
5. `updateAssignment()` - 4 edges
6. `lib` - 4 edges
7. `Home()` - 3 edges
8. `ServiceLineupPage()` - 3 edges
9. `RoleAssignmentRow()` - 3 edges
10. `addPerson()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `createClient()`  [EXTRACTED]
  src/app/page.tsx → src/lib/supabase/server.ts
- `PeoplePage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/people/page.tsx → src/lib/supabase/server.ts
- `ServiceLineupPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/services/[id]/page.tsx → src/lib/supabase/server.ts
- `RoleAssignmentRow()` --calls--> `updateAssignment()`  [EXTRACTED]
  src/components/RoleAssignmentRow.tsx → src/lib/actions.ts
- `addPerson()` --calls--> `createClient()`  [EXTRACTED]
  src/lib/actions.ts → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (19 total, 12 thin omitted)

### Community 0 - "TypeScript Compiler Options"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 1 - "Lineup App Pages & Server Actions"
Cohesion: 0.25
Nodes (11): PeoplePage(), formatDate(), ServiceLineupPage(), Person, RoleAssignmentRow(), addPerson(), addService(), deletePerson() (+3 more)

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

## Knowledge Gaps
- **57 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `NPM Scripts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `TypeScript Compiler Options` to `TypeScript File Globs`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Core Runtime Dependencies` to `NPM Scripts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Options` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._