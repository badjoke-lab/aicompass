# Exec Plan: aims-v2-data-model

## Goals
- Extend the internal data model to capture richer metadata, evidence, and history for each model without altering the current UI.
- Preserve the aims-v1 scoring + leaderboard behavior while laying groundwork for aims-v2 features.

## Plan
1. **Scope + guardrails** – Confirm no AGENTS.md overrides; keep work limited to TS types, JSON data, and optional short docs.
2. **Metadata extensions** – Update `types/model.ts` with vendor/release/modality/parameter/training-disclosure/eval-repro fields and set optional defaults; propagate placeholders inside `data/models/index.json`.
3. **Evidence structure** – Define a richer evidence item/type supporting multiple entries per category (PERF, SAFETY, COST, RELIAB., TRANSP., ECOSYS., ADOPTION) and wire into consuming code/data.
4. **History typing** – Introduce or refine a `ModelHistoryEntry` with subscores so that existing 30-day delta logic can rely on it without UI change.
5. **Docs + verification** – Optionally note the v2 data additions in `docs/aims-v2-notes.md`, run `npm run lint` + `npx tsc --noEmit`, and ensure UI builds unchanged.

## Status
- 2025-02-15: Plan created.
