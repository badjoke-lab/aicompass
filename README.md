# AI Model Scoreboard

AI Model Scoreboard publishes an independent, evidence-first leaderboard for foundation models. It tracks seven transparent categories per model, surfaces 30-day movement, and links directly to the public artifacts that justify each score.

- Live site: https://ai-model-scoreboard.vercel.app/
- Spec & docs: [docs/aims-v1-spec.md](docs/aims-v1-spec.md)
- Public Methodology: https://ai-model-scoreboard.vercel.app/methodology

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

## Donation story
The `/donation` page keeps AI Model Scoreboard independent while production payment rails are finalized. It currently lists placeholder Stripe Payment Link and Ko-fi URLs plus temporary BTC / ETH / USDT wallets so supporters can bridge the gap. Reach out to hello@aimodelscoreboard.org for invoices, bank instructions, or verified wallet credentials.

## Additional references
- [docs/changelog.md](docs/changelog.md) – short release notes for aims-v1 foundation + UI work.
- `/about`, `/methodology`, and `/donation` routes provide the public-friendly context for visitors and funders.
