# ExecPlan: aims-v2-beta-ui

## Objectives
- Ship the public-facing aims-v2 UI for `/scores` and `/models/[slug]`, replacing the legacy v1 presentation while keeping `/v2/*` as the prototype sandbox.
- Use the aims-v2 score engine and data model for leaderboard ordering, deltas, trend velocity, volatility, transparency, and ecosystem depth metrics.
- Align spacing, typography, and tone with the existing aims-v2 alpha visuals but remove alpha-only disclaimers for the public surface.

## Main changes
- New `/scores` experience built on v2 snapshots with desktop table and mobile card layouts that expose total, weighted delta, trend velocity, volatility, transparency compliance, and ecosystem depth.
- Updated `/models/[slug]` detail view to use v2 metrics, highlighting total score, subscores (performance, safety, cost, reliability, transparency, ecosystem, adoption), weighted delta inputs, trend velocity, volatility, and evidence.
- Root route delegates to the new public scores page so the v2 beta UI is the default public experience while `/v2/*` remains untouched.
- Added shared v2 leaderboard componentry to keep the mobile and desktop layouts consistent with the aims-v2 visual language.

## Validation
- [ ] `npm run lint`
- [ ] `npx tsc --noEmit`
- [ ] `npm run build`

### Notes
- No binary image assets were added; screenshots can be captured externally if needed.
- Methodology and donation links remain unchanged; alpha-only banners have been removed from the public v2 beta UI.
