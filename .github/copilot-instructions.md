# Copilot instructions for todolist-demo

This repository is a small Vite + React + Tailwind todo app. The instructions below focus on repository-specific tooling, architecture, and conventions so future Copilot sessions can act accurately.

## Build / Run / Test / Lint
- Install: npm install
- Dev server: npm run dev  (opens Vite dev server, typically http://localhost:5173)
- Production build: npm run build
- Preview production build locally: npm run preview

Notes: No test or lint scripts are present in package.json. There is no test runner configured; add one (Vitest/Jest) if you want Copilot to run tests. Because no test scripts exist, there is no single-test command to document.

## High-level architecture
- Entry: index.html -> src/main.jsx mounts React app into #root.
- App: src/App.jsx is the primary application component used by the dev server. It contains todo state, UI, and filtering logic.
- Alternate UI: ToDoList-2.jsx at repo root is a separate, more featureful example component (priority support, different state shape). It is not imported by src/main.jsx by default.
- Styling: Tailwind is used site-wide. src/index.css imports Tailwind. Vite plugins are configured in vite.config.js (plugin-react and @tailwindcss/vite).
- Tooling: Vite dev/build/preview scripts are defined in package.json.

## Key conventions & gotchas
- Two different todo shapes exist in the repo:
  - src/App.jsx: { id, text, done } (uses `done` boolean and filter values 'all'|'active'|'completed')
  - ToDoList-2.jsx: { id, text, completed, priority } (uses `completed` boolean and priority strings)
  Keep this in mind when refactoring or swapping components — property names and filter string casing are not consistent.
- IDs are created with Date.now() in both examples; collisions are unlikely in this demo but not guaranteed for production.
- Filter values are case-sensitive across components (e.g., 'All' vs 'all').
- Styling relies solely on Tailwind classes; there is no custom CSS besides the Tailwind import.
- No TypeScript; all files are plain JS/JSX using ES modules.

## Files to inspect first
- src/main.jsx — app bootstrap
- src/App.jsx — canonical app used by the dev server
- ToDoList-2.jsx — alternate, more feature-rich example
- vite.config.js and src/index.css — Tailwind + Vite integration

## AI / assistant config files checked
- No CLAUDE.md, AGENTS.md, .cursorrules, .windsurfrules, CONVENTIONS.md, or other assistant rule files were found in the repository root.

If you want further detail (example migration steps to unify todo shapes, add tests, or configure CI), say which area to expand.
