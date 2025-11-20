# Exec Plan: aims-v2-ui-rebuild

## Scope
- Rebuild the internal-only AIMS v2 experience strictly inside `app/v2/**`, `lib/v2/**`, and optional `components/v2/**` without touching any public v1 files or routes.
- Deliver three refreshed surfaces:
  1. `/app/v2/leaderboard` — full v2 leaderboard showing rank, totals, weighted delta, velocity, volatility, transparency, and ecosystem depth.
  2. `/app/v2/models/[slug]` — comprehensive model profile combining metadata, evidence, velocity charts, transparency ratios, and ecosystem depth.
  3. `/app/v2/internal/dashboard` — diagnostics cockpit covering health, completeness, spikes, transparency alerts, and backlog signals.
- Use only the v2 helpers from `lib/v2/**`; Tailwind tokens may mirror v1 values but v1 components must not be imported or reused.

## Layout structure
- Keep `app/v2/layout.tsx` as the isolated shell; extend with local primitives (headers, cards, grids) built under `components/v2/**` as needed.
- Leaderboard: table-first layout with compact badges and inline spark bars for velocity/volatility where helpful; server components that read from `v2ScoreEngine` snapshots.
- Model detail: two-column responsive grid; left for metadata/summary, right for charts and transparency ratios; include evidence table and ecosystem depth stacks.
- Internal dashboard: card grid for summary metrics, anomaly panels, completeness/evidence progress, and backlog/alert feeds; reuse shared v2 UI primitives only.

## File locations
- `app/v2/leaderboard/page.tsx` — rebuild leaderboard using v2-only UI components and helpers.
- `app/v2/models/[slug]/page.tsx` — new detail page composed of modular blocks (summary, velocity chart, transparency, evidence, ecosystem).
- `app/v2/internal/dashboard/page.tsx` — refreshed diagnostics dashboard using the same v2 primitives.
- `components/v2/*` — shared widgets (metric cards, ratio bars, spark bars, table shells) scoped to v2.
- `lib/v2/*` — any new selector/helpers for formatting v2 data; keep data access in v2 namespace.

## Helper usage
- Data sources: `v2ScoreEngine` for leaderboard/model metrics; `getInternalDashboardData` for diagnostics; transparency/velocity helpers already exposed in `lib/v2`.
- Utility functions: prefer formatter helpers in `lib/v2` or new ones added there; avoid pulling from v1 libs or components.
- Charts/sparks: build minimal server-friendly visualizations (e.g., CSS-based bars/spark lines) rather than importing v1 chart components.

## Safety checks
- Allowed paths only: `app/v2/**`, `lib/v2/**`, `components/v2/**`, and `docs/ExecPlan-*.md`. Any need to touch other paths halts work until plan is updated.
- Preserve v1: no edits to `app/page.tsx`, `app/scores/**`, `app/models/**`, `app/metrics/**`, `app/(score)/**`, or `app/internal/**`.
- Verification: after implementation, run `npm run lint` and `npx tsc --noEmit`; ensure v1 routes remain unaffected.
- Isolation: keep new components self-contained with v2 naming to avoid accidental reuse by v1.
