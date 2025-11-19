# Exec Plan: aims-v2-history

## Goals
- Extend the aims-v2 data model with richer score history for each model (beyond a single 30-day delta).
- Keep the public leaderboard UI and navigation exactly as-is, while adding an internal history view for operators.
- Reuse existing helpers from aims-v2-data-model and aims-v2-core; do not change deployment settings or AGENTS files.

## Plan
1. **Scope & inventory**
   - Review the current aims-v2 data model and core helpers (models, evidence, history types).
   - Identify where 30-day deltas are currently computed and how history is stored (types + data files).
2. **History data extensions**
   - Define a typed history collection per model (e.g., a list of `ModelHistoryEntry` with date, TOTAL, and subscores).
   - Update the data files to include a small but realistic sample history for each tracked model (for example, 6–12 points over the last 60–90 days).
   - Ensure the existing 30-day delta logic reads from this history without changing current leaderboard output.
3. **Derived stats helpers**
   - Add helpers in `lib/` to compute basic derived stats from history: 30-day change (already used by the leaderboard), a simple volatility indicator (e.g., standard deviation or "stable / mixed / volatile" buckets), and count of updates in the last 30 days.
   - Keep the API minimal and focused on reuse by future features.
4. **Internal history view (debug only)**
   - Add a lightweight internal page, e.g. `/internal/history` or `/internal/stats`, not linked from the main navbar.
   - For each model, show: name, vendor, and TOTAL score; a simple sparkline or list of recent history points; the derived stats (30-day change, volatility label, update count).
   - Match the existing dark theme and typography, but keep it simple; this is an operator/debug view.
5. **Docs & notes**
   - Append a short section to `docs/aims-v2-spec.md` (or `docs/aims-v2-notes.md`) describing the new history fields, the derived stats helpers, and the purpose of the internal history view.
   - Do not modify brand/marketing copy outside the v2 docs.
6. **Validation & PR**
   - Run `npm run lint` and `npx tsc --noEmit`.
   - Confirm that the public leaderboard and existing pages behave exactly as before, and that the new internal route loads and shows history for all models without errors.
   - Open a clean PR against `main` summarizing the history data extensions, helpers, internal view, and tests.

## Status
- 2025-02-16: Plan created for aims-v2 history and internal stats view.
