# AI Model Scoreboard

Transparent, evidence-first leaderboard for foundation models. This repo hosts the aims-v1 static site built with Next.js 14 and Tailwind CSS.

## Methodology Highlights
- **Evidence-first**: Every score must link to a public artifact (eval reports, release notes, pricing updates, or policy docs). Conflicting data defaults to the lower score until corroborated.
- **Seven categories**: Performance, Safety & Alignment, Cost & Efficiency, Reliability, Transparency, Ecosystem, and Adoption are scored 0–100 before rolling into the composite total.
- **30-day delta rule**: Movement posts only when two independent datapoints exist inside a 30-day window, with spikes triggered when |Δ| ≥ 3.
- **Transparency requirements**: Missing documentation places models in a waiting state and removes them from spike math until disclosures are public.

## Donation placeholders
While production payment rails are being finalized, the `/donation` page lists placeholder options:
- Stripe Payment Link placeholder (`https://stripe.com/payments/placeholder`).
- Ko-fi profile placeholder (`https://ko-fi.com/placeholder`).
- Crypto cards for BTC, ETH, and USDT with sample wallet IDs and memos.

Email **hello@aimodelscoreboard.org** for invoices, bank instructions, or verified wallet addresses.

## Development
```bash
npm install
npm run dev
```

Quality checks:
```bash
npm run lint
npx tsc --noEmit
```

## Screenshots
Updated UI captures (home leaderboard + methodology) live under `/artifacts` after each release.
