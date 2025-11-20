# Exec Plan: aims-v2-isolation

## Goals
- Physically separate aims-v1 and aims-v2 code so Codex never touches v1 public routes for v2 work.
- Remove any remaining v2 references from public v1 routes.
- Keep all v2 surfaces contained under `/app/v2/*` and `/lib/v2/*`.

## Plan
1. **Audit v1 routes**
   - Review `/app/page.tsx` and other public v1 routes to confirm there are no imports from `lib/v2` or internal v2 helpers.
   - Strip any lingering v2-only imports or components if present, keeping v1 logic intact.
2. **Relocate v2 surfaces**
   - Move internal dashboards or diagnostics that consume v2 helpers into `/app/v2/**` so v2 logic stays isolated.
   - Ensure v1 pages rely only on `lib/models`, `data`, and shared UI utilities.
3. **Re-scope v2 imports**
   - Update moved routes to import from `/lib/v2` only.
   - Remove `/app/internal/**` or other non-v2 locations that point at v2 helpers.
4. **Validation**
   - Search the repo to verify no v2 imports remain in v1 routes.
   - Confirm `/v2/*` routes load using v2 helpers while `/` and `/models/*` stay v1-only.
5. **Checks**
   - Run `npm run lint` and `npx tsc --noEmit`.

## Status
- 2025-02-19: Plan created to isolate aims-v2 code paths under `/app/v2` and `/lib/v2`.
