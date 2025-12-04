# V4 API

The v4 API introduces stable, type-safe endpoints that return placeholder payloads while the new scoring and pipeline work is
completed. Responses are intentionally simple and include canonical headers that prevent indexing by crawlers.

## Conventions
- All endpoints return JSON objects with a `status` field.
- Error responses use `{ status: "error", message }` and include `X-Robots-Tag: noindex, nofollow` headers.
- Successful responses also include the `X-Robots-Tag` header to keep endpoints undiscoverable until launch.

## Endpoints

### GET `/api/snapshot`
Returns the current snapshot placeholder. The payload is typed as `SnapshotResponse` from `lib/v4/types.ts`.

```json
{
  "status": "ok",
  "updated": null,
  "models": []
}
```

### GET `/api/models`
Returns the placeholder model index and provider summary. The payload is typed as `ModelListResponse` from `lib/v4/types.ts`.

```json
{
  "status": "ok",
  "providers": [],
  "total": 0
}
```

## Error Handling
All v4 handlers wrap their logic with `withError` from `lib/v4/http.ts`. Any exception produces a structured response:

```json
{
  "status": "error",
  "message": "<description>"
}
```

## Headers
`lib/v4/http.ts` exposes `noindexHeaders` so handlers consistently apply the canonical `X-Robots-Tag` directive for the v4
namespace.
