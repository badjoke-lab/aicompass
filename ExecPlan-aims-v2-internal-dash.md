# Exec Plan: aims-v2-internal-dash

## Goals
- Re-read aims-v2 ExecPlans (data-model, history, core) and build a unified internal dashboard living at `/v2/internal/dashboard`.
- Aggregate v2 metrics, anomaly detection (spikes + transparency violations), metadata & evidence completeness, trend velocity charts, and a 0–100 health score for internal operators.
- Keep everything internal-only without modifying public aims-v1 UI/routes, deployment config, environment variables, or AGENTS files.
- Reuse existing v2 helpers in `lib/v2/` and extend them minimally with deterministic, typed computations to power the dashboard.
- Provide a desktop-focused UI (Next.js app directory) plus supporting helpers/tests, then run lint + typecheck and document with screenshots + PR summary.

## Plan
1. **Inventory & alignment**
   - Re-read aims-v2 ExecPlans (data-model, history, core) plus current internal pages under `app/v2/internal/*`.
   - Note existing helpers in `lib/models`, `lib/historyStats`, and `lib/v2` for reuse.
2. **Helper extensions**
   - Add any missing deterministic helpers under `lib/v2/` (or sibling modules) to compute:
     - Aggregated v2 metrics per model (reuse `V2ScoreEngine`).
     - Metadata completeness (required fields coverage), evidence completeness (counts per bucket), anomaly detection (spike detection & transparency compliance thresholds), and internal health scoring (0–100) per model and globally.
     - Trend velocity data series suitable for charts.
   - Ensure helpers are typed and leverage existing models/types.
3. **Data plumbing**
   - Create a typed dashboard data loader (e.g., `lib/v2/dashboard.ts`) that packages all required aggregates for the UI in one deterministic call, caching if needed for reuse.
4. **Internal dashboard UI**
   - Build `/v2/internal/dashboard/page.tsx` plus supporting components (e.g., `components/internal/dashboard/*`) focused on desktop layout.
   - Sections: summary KPIs (health score, tracked models, volatility mix), anomaly lists (spikes, transparency issues), metadata/evidence completeness tables, velocity charts per model, evidence completeness heatmap, and metrics table referencing v2 snapshots.
   - Use existing design tokens (Tailwind classes) consistent with other internal pages; no public UI changes.
5. **Charts & visualizations**
   - Implement lightweight deterministic charts (SVG/Canvas) or stacked bar/line approximations without introducing heavy dependencies; can reuse existing sparkline style if available.
6. **Validation & polish**
   - Ensure deterministic computations, typed exports, and tests if feasible.
   - Capture desktop-only screenshot(s) of the new dashboard.
   - Run `npm run lint` and `npx tsc --noEmit`.
   - Prepare PR summarizing the dashboard, helpers, and validation.

## Status
- 2025-02-19: Plan created.
