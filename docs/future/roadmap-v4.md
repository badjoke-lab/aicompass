# V4 Roadmap

## Objectives
- Introduce multi-snapshot history with incremental refresh to reduce upstream load while enabling trends (v3 is single-snapshot only).
- Add model family rollups and capability tags to make comparisons clearer and filterable.
- Expand API surface for public consumption (pagination, filters, deltas) without breaking v3 clients.
- Tighten operational visibility (queue health, cache saturation, upstream quota usage) to make incidents easier to triage.
- Prepare monetization hooks (premium filters, private model opt-ins, SLA-bound webhooks) without locking the core experience.

## Phase breakdown

### v4.0 (foundations)
- **Features**: Historical snapshot storage (rolling 30 days), delta computation (24h/7d), capability tags on models, backward-compatible API versioning (`/api/v4/*`), cache invalidation hooks, basic queue instrumentation.
- **Required data**: Per-snapshot metrics (downloads, likes, lastModified), derived deltas, capability tags (manually curated list), snapshot metadata (source count, TTL, upstream call budget).
- **Risks**: Storage growth for snapshots; migration risk while keeping v3 responses stable; manual tag curation drift.
- **User impact**: Users see trend lines and tags on leaderboard/detail; API consumers can request v4 without breaking v3.
- **Monetization hooks**: Reserved response fields for premium filters (`tier`, `access`), ability to flag private feed sources (config-only).
- **Done definition**: v4.0 endpoints ship behind `/api/v4`; leaderboard shows tags and delta badges; snapshot history persists 30 days; cache/queue health visible in health endpoint; v3 responses unchanged.

### v4.1 (filters + webhooks)
- **Features**: Client-side filters (capabilities, provider, license, parameter class), paginated API, webhook subscription for snapshot updates with HMAC signing, rate-limit headers.
- **Required data**: Normalized metadata for provider/license/parameters; webhook registry (in config or env); signed delivery logs.
- **Risks**: Webhook spam/abuse; pagination introducing query complexity; filter performance if cache misses rise.
- **User impact**: Faster discovery via filters; integrators can receive push updates instead of polling.
- **Monetization hooks**: Webhook concurrency and filter depth can be gated by plan; include `X-Plan` echo in responses.

### v4.2 (scoring + insights)
- **Features**: Optional weighting profiles (research, production, community), anomaly detection for velocity, model family rollups with drill-down, richer health metrics (HF quota consumption, backlog depth, cache hit rate).
- **Required data**: Additional scoring weights; baseline thresholds per profile; anomaly detection thresholds; rollup mappings for families.
- **Risks**: Scoring explainability; added compute for anomaly detection; rollup accuracy if mappings stale.
- **User impact**: Users can toggle scoring profiles and get clearer context on outliers; admins see operational insights.
- **Monetization hooks**: Custom weighting profiles and anomaly exports treated as premium toggles.

### v4.3+ (stretch)
- **Features**: SLA-grade endpoints (priority queues), private model ingestion, partner-specific badges, CSV export API.
- **Required data**: Auth tokens for private feeds; partner badge config; export batching metadata.
- **Risks**: Security surface for private models; SLA maintenance.
- **User impact**: Enterprise-focused reliability and customization.
- **Monetization hooks**: SLA tiers, private feed surcharges, partner branding.
