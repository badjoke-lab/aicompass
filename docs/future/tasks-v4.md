# V4 Task Queue

> Priority labels: **must** (blocks v4.0), **should** (needed for v4.1), **could** (stretch or v4.2+).

1. **must** — Introduce snapshot history storage layer (rolling 30 days) with delta computation job.
   - Touchpoints: `lib/v4/snapshot.ts`, `lib/v4/storage/*`, `lib/v4/jobs/history.ts`, tests/fixtures.
2. **must** — Add v4 API routes with adapters preserving v3 (`/api/v4/snapshot`, `/api/v4/health`, `/api/v4/models`).
   - Touchpoints: `app/api/v4/snapshot/route.ts`, `app/api/v4/health/route.ts`, `app/api/v4/models/route.ts`, shared serializers.
3. **must** — Extend model schema with capabilities, family, parameters, license, tier/access, and delta fields.
   - Touchpoints: `lib/v4/types.ts`, `lib/v4/normalize.ts`, `lib/v4/scores.ts`, data fixtures.
4. **must** — Update scoring module to support weighting profiles and anomaly flags with validation fixtures.
   - Touchpoints: `lib/v4/scores.ts`, `tests/v4/scores.test.ts`, config for profiles.
5. **must** — Enhance health reporting with queue stats, cache metrics, and HF quota usage.
   - Touchpoints: `lib/v4/health.ts`, `app/api/v4/health/route.ts`, logging instrumentation.
6. **should** — Implement homepage filters, delta badges, and pagination controls guarded by v4 feature flag.
   - Touchpoints: `app/page.tsx`, `components/Leaderboard/*`, `lib/v4/client.ts`.
7. **should** — Model detail page enhancements (family rollup, license/parameters, profile selector, anomaly badges, trend sparkline).
   - Touchpoints: `app/models/[slug]/page.tsx`, `components/ModelDetail/*`, chart helper.
8. **should** — API documentation updates for v4 routes, filters, pagination, webhook signing, and rate limits.
   - Touchpoints: `docs/api.md`, new `docs/v4-api.md` or sections within docs site.
9. **should** — Webhook subscription endpoint with signed delivery and delivery logs.
   - Touchpoints: `app/api/v4/webhooks/route.ts`, `lib/v4/webhooks.ts`, logging/storage backend.
10. **could** — Anomaly detection tuning job with alerting hooks.
    - Touchpoints: `lib/v4/anomaly.ts`, `lib/v4/jobs/anomaly.ts`, alerting config.
11. **could** — Partner/enterprise toggles (SLA headers, premium filters, plan echo) with config-based gating.
    - Touchpoints: `lib/v4/config.ts`, middleware for headers, feature flag plumbing.
12. **could** — CSV export endpoint for snapshots with pagination-aware batching.
    - Touchpoints: `app/api/v4/export/route.ts`, `lib/v4/export.ts`, streaming helpers.
