# V4 Technical Specification

## Data pipeline changes
- **Snapshot storage**: Persist rolling 30 days of snapshots with per-snapshot metadata (`updatedAt`, `sourceCount`, `readyCount`, `hfBudgetUsed`, `ttlSeconds`). Store deltas (24h/7d) as derived fields to avoid recomputing per request.
- **Schema additions**: Extend model entries with `capabilities` (array of tags), `family`, `parameters` (numeric + class), `license`, `tier` (free/premium), `access` (public/private), and `delta` object (`downloads24h`, `likes24h`, `downloads7d`, `likes7d`, `rankChange`).
- **Caching rules**: Maintain in-memory hot cache for latest snapshot, plus on-disk or KV cache for history. Cache keys include version (`v4`) and snapshot date. Revalidate homepage every 5 minutes; force refresh on webhook delivery or admin trigger.
- **Refresh triggers**: Scheduled rebuild every hour; manual invalidate endpoint; automatic refresh when upstream metadata change exceeds threshold (e.g., >5% downloads delta) detected during lightweight head requests.

## API changes
- **Versioned routes**: Add `/api/snapshot`, `/api/health`, `/api/models`. Preserve `/api/snapshot` and `/api/health` as compatibility endpoints.
- **Modified response shapes**:
  - Snapshot response includes history metadata (`historyDays`, `snapshotCount`), deltas per model, capability tags, `family`, `parameters`, `license`, `tier`, `access`, and `scores.profile` (active weighting profile). Pagination support via `cursor` for `/api/models` with `limit` and `filters` query params.
  - Health response adds queue status (`pending`, `inflight`, `failed`), cache stats (`hitRate`, `evictions`), and upstream quota usage (`hfRemaining`, `lastRefill`).
- **New behaviors**: Optional webhook handshake endpoint `/api/webhooks/test` returning signed challenge; rate-limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) on routes.

## Scoring model changes
- **Profiles**: Support named weighting profiles (`default`, `research`, `production`, `community`) defined in config. Response includes the profile used and raw component scores.
- **Anomaly flags**: Add `anomaly.velocity` and `anomaly.downloads` booleans when change exceeds configured z-score or percentile threshold.
- **Validation**: Unit fixtures covering known models to ensure profile weights produce expected ordering; deterministic scoring by rounding inputs before weighting; CI check to compare ordering deltas within tolerance.

## UI/UX changes
- **Leaderboard page**: Add capability tag chips, 24h/7d delta badges, filter drawer (capabilities, provider, license, parameter class), pagination controls when results exceed page size.
- **Model detail page**: Show family rollup, parameter count and license, trend sparkline for downloads/likes, anomaly badges, and profile selector for scoring.
- **Health/admin surface**: Display queue depth, cache hit rate, and HF quota usage; include manual refresh action (guarded in config).
- **API docs page**: New section for unified routes, parameter examples, webhook signing guide, and rate-limit semantics.

## Migration notes (v3 → v4)
- Keep v3 endpoints untouched; introduce unified routes under `/api/*` with parallel responses.
- Data layer should store v4-only fields without changing v3 snapshot shape; use adapters to project v3 view from the same source.
- Feature flags for UI: hide filters and deltas until v4 snapshot present to avoid runtime errors.
- Backfill: first deploy with history collection disabled, then enable rolling history once storage verified.
- Documented fallback: if v4 cache or history fails, serve last known v3 snapshot and surface warning in health.
