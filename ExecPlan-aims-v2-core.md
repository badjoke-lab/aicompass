# Exec Plan: aims-v2-core

## Goals
- Keep the current aims-v1 UI and leaderboard behavior identical while adopting the new aims-v2 data model.
- Centralize reads/writes of model metadata, evidence, and history into well-typed helpers so future aims-v2 features can plug in cleanly.
- Do not touch deployment settings, AGENTS files, or UI styling; stay in TypeScript types, data files, and core libs only.

## Plan
1. **Inventory & constraints**  
   - Review the existing "aims-v2-data-model" ExecPlan and the new types/data it introduced.  
   - Scan `types/`, `data/`, and relevant `lib/*` helpers that handle scores, deltas, or evidence.  
   - Confirm there are no AGENTS overrides to edit and keep all work inside the app codebase.
2. **Core helpers for models**  
   - Add or refine typed helpers such as `getModelBySlug`, `listModels`, and `getModelSummary` in an appropriate `lib` module.  
   - Ensure these helpers surface the new metadata fields (vendor, release date, modality, parameters, disclosure levels) while remaining compatible with existing call sites.
3. **Evidence plumbing**  
   - Introduce helpers to fetch evidence per model and scoring category using the richer aims-v2 evidence structure.  
   - Keep UI consumers tolerant of missing evidence—no UI changes yet, just safe access patterns.
4. **History + 30-day deltas**  
   - Wire the `ModelHistoryEntry` type into the 30-day delta logic so it reads from typed history arrays instead of ad-hoc structures.  
   - Preserve current delta behavior and thresholds so leaderboard output stays identical.
5. **Light docs & notes**  
   - Optionally append concise guidance to `docs/aims-v2-notes.md` and/or `docs/aims-v2-spec.md` on the new helpers and their relationship to the aims-v2 data model.  
   - Focus documentation on compatibility and future extensibility.
6. **Validation & PR**  
   - Run `npm run lint` and `npx tsc --noEmit` to ensure linting and type checking pass.  
   - Open a clean PR against `main` summarizing the new helpers, their data-model alignment, and confirmation that UI/scores remain unchanged.

## Status
- 2025-02-16: Plan created for aims-v2 core refactor.
