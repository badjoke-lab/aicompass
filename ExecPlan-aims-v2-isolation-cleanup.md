# Exec Plan: aims-v2-isolation-cleanup

## Goals
- Ensure no aims-v2 code is referenced from any public aims-v1 routes.
- Remove any lingering v2 imports, helpers, or utilities from v1 pages so they rely solely on v1 logic.
- Guarantee the `/app/scores` (public leaderboard) and `/app/models/[slug]` detail pages remain 100% v1-only.

## Plan
1. **Scan for v2 imports in v1 surfaces**
   - Search for imports containing `lib/v2`, `/v2/internal`, `v2ScoreEngine`, or `v2HistoryStats` across non-v2 directories.
   - List any v1 files that still reference v2-only helpers.
2. **Clean v1 files**
   - Remove v2 imports from v1 routes and components; replace usages with existing v1 helpers or omit the v2-only behavior while keeping the UI unchanged.
   - Avoid adding any new v2 imports or coupling from v1 pages.
3. **Verify v1 purity**
   - Confirm `app/scores/page.tsx`, `app/models/[slug]/page.tsx`, and other public pages import only v1 helpers (e.g., `lib/models`).
   - Ensure no v2-specific helpers, types, or utilities are referenced from v1 routes.
4. **Checks**
   - Run `npm run lint`.
   - Run `npx tsc --noEmit`.

## Status
- 2025-02-23: Plan created to clean any lingering v2 references from public aims-v1 routes.
