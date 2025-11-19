# Exec Plan: aims-v2-data-model

## Goals
codex/start-execplan-for-aims-v2-data-model-1lv5c5
- Extend the internal data model so the AI Model Scoreboard can capture richer metadata, evidence, and score history per model, without changing the existing aims-v1 UI.
- Preserve all current aims-v1 scoring, leaderboard behavior, and 30-day deltas while preparing the codebase for future aims-v2 features.
- Keep changes scoped to TypeScript types and local data artifacts (no backend) and document any new fields briefly if needed.

## Plan
1. **Constraints & inventory** – Confirm repo guardrails (no AGENTS files), review current data sources (`data/`, `types/`, relevant `lib/` helpers) and note surfaces affected by model typing (scores, leaderboard, deltas).
2. **Model metadata extensions** – Update shared types/interfaces (e.g., `types/models.ts`, `types/scores.ts`, or equivalents) to add `vendor`, `release_date`, `modality`, `parameter_size`, `training_disclosure_level`, `eval_reproducibility_level` with safe optional/default semantics.
3. **Evidence structure** – Introduce a typed evidence collection per scoring category (likely in `types/scores.ts` and any `data/*.ts` where evidence lives), ensuring the UI consumers can ignore the new structure for now.
4. **History typing for 30-day window** – Define a reusable score history type (date + total/subscores), refactor existing delta logic to rely on this type without altering behavior, and seed minimal sample history data.
5. **Data updates** – Patch the relevant `data/models.ts`/JSON to include placeholder metadata, evidence arrays, and history samples aligned with the new types.
6. **Docs (optional)** – If clarity is useful, author `docs/aims-v2-notes.md` describing the new fields and compatibility story.
7. **Validation** – Run `npm run lint` and `npx tsc --noEmit`; ensure UI remains unchanged, then prepare PR notes referencing the data model changes and tests.

## Status
- 2025-02-16: Plan created.

