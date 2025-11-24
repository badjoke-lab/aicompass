# v4 API overview

Experimental v4 endpoints are namespaced under `/api/v4`. Responses include a
`X-Robots-Tag: noindex, nofollow` header to keep the surface out of search
indexes while the interface settles.

## Base endpoint

- **Path:** `/api/v4`
- **Response:**
  - `{ version: "v4", status: "ok", message: "AI Model Scoreboard v4 foundation is active" }`

## Snapshot

- **Path:** `/api/v4/snapshot`
- **Response:**
  - `{ status: "ok", updated: null, models: [] }`
- **Notes:** Provides a placeholder payload for the eventual snapshot service
  that will combine model metadata and scoring outputs.

### Snapshot refresh

- **Path:** `/api/v4/snapshot/refresh`
- **Response:**
  - `{ status: "ok", updated: "<ISO 8601>", models: [] }`
- **Notes:** Returns the same stub shape as `/snapshot` while marking the request
  time in `updated` to signal a fresh run.

## Models

- **Path:** `/api/v4/models`
- **Response:**
  - `{ status: "ok", providers: [], total: 0 }`
- **Notes:** Serves a stubbed registry of providers and models. The structure is
  designed to support grouped providers with model entries as data becomes
  available.
