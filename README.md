# AI Model Scoreboard

AI Model Scoreboard (aims-v3) publishes a minimal leaderboard sourced directly from public Hugging Face metadata. Each refresh
pulls real download/like counts and last-update timestamps, normalizes them, and rolls them into a deterministic composite
score. No mock data or manual overrides are used.

- Live site: https://ai-model-scoreboard.vercel.app/
- Snapshot API: `/api/snapshot` returns the same data the UI renders
- Health check: `/api/health` reports live fetch/cache/score status
- Manual refresh: `/api/snapshot/refresh` recomputes the cache (used by cron)
- Methodology: https://ai-model-scoreboard.vercel.app/methodology

## Getting started
Requirements:
- Node.js 18+
- npm 10+

Install dependencies and start the dev server:
```bash
npm install
npm run dev
```

## Testing
```bash
npm run lint
npx tsc --noEmit
```

## Data sources (v3)
- Hugging Face model metadata: downloads, likes, and `lastModified` timestamps are fetched per tracked repo.
- Scores: min–max normalization across the live set plus fixed weights (adoption 45%, ecosystem 35%, velocity 20%).
- Resilience: fetch attempts are retried with backoff and cached for a few minutes to reduce 500s.

## Donation story
The `/donation` page keeps AI Model Scoreboard independent while production payment rails are finalized. It currently lists
placeholder Stripe Payment Link and Ko-fi URLs plus temporary BTC / ETH / USDT wallets so supporters can bridge the gap. Reach
out to hello@aimodelscoreboard.org for invoices, bank instructions, or verified wallet credentials.
