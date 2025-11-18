# AI Model Scoreboard – aims-v1 Specification

## Overview
AI Model Scoreboard is an independent, evidence-first leaderboard that ranks foundation-model families across a consistent, public rubric. It exists so that operators, evaluators, policy and procurement teams, and technically curious observers can compare models without depending on vendor marketing. The aims-v1 release focuses on surfacing trustworthy scores, linking to primary evidence, and showcasing meaningful movement across the ecosystem.

## Scoring model
- **Categories** – Each tracked model receives seven subscores, each on a 0–100 scale: Performance, Safety & Alignment, Cost & Efficiency, Reliability, Transparency, Ecosystem, and Adoption. Scores are kept granular so the community can see exactly where a model is strong or weak.
- **TOTAL score** – The public leaderboard surfaces a TOTAL column that rolls up the seven categories into a single composite number. Unless explicitly noted otherwise in the Methodology, TOTAL represents the equally weighted average of the most recent valid subscores, rounded to the nearest tenth.
- **30-day delta rule** – Movement indicators only trigger when at least two independent data points fall within a rolling 30-day window. Spikes are highlighted when the absolute delta is ≥ 3 points; otherwise the change is logged silently.
- **Evidence-first transparency** – Every score must cite a public artifact such as an eval report, pricing bulletin, or policy disclosure. Missing or conflicting sources default to the lower score and may place the model into a waiting state until evidence is supplied. The [Methodology page](https://ai-model-scoreboard.vercel.app/methodology) is the human-friendly overview of these requirements, while this spec documents the internal intent.

## UI & pages
- **Leaderboard (home page)** – `/` renders the flagship leaderboard. On desktop, visitors see a top stats bar that calls out the total number of tracked models, average TOTAL score, and most recent updates. A full-width table lists every model, showing the vendor, modality tags, TOTAL, seven subscores, 30-day delta chips, and evidence icons. On smaller screens the layout adapts into stacked cards while preserving the same data. A "Spikes & Movers" panel highlights the biggest recent changes with contextual messaging.
- **Model detail page** – `/models/[slug]` shows a deep dive for each model family. It includes vendor + modality metadata, the TOTAL value with sparkline history, and the seven category chips with descriptions. Status chips communicate where the model stands today:
  - `LEADER` indicates the highest TOTAL in the active cohort.
  - `SPIKE ↑` and `SPIKE ↓` call attention to recent upward or downward movement that crossed the 30-day delta threshold.
  - `WAITING` is applied when required documentation is missing or under review.
  Evidence links are grouped by category so visitors can audit the source material directly from each detail page.
- **Supporting pages** –
  - **About** explains the mission, independence, and the community steering the scoreboard.
  - **Methodology** summarizes the scoring rules in plain English and links to the deeper spec.
  - **Donation** invites supporters to fund hosting, independent evaluations, and data collection.

## Data & operations
- **Storage** – Model metadata and scores currently live in local JSON/TypeScript files under `data/models` and `types/`. There is no production database in aims-v1.
- **Updates** – Adding a new model or adjusting scores involves editing the JSON records, keeping evidence citations in sync, and re-running the static build. Until automation lands, the team manually reviews source material, updates the files, and commits the changes.
- **Rolling window** – Every subscore tracks its "last updated" timestamp. Reviewers re-evaluate the inputs on an intended weekly cadence, but a score only publishes when two corroborating inputs fall within 30 days. This protects against sudden swings from single vendor statements.

## Donation & sustainability
The `/donation` page currently presents placeholder Stripe Payment Link and Ko-fi URLs, plus placeholder BTC, ETH, and USDT wallet cards. These stay live until production payment rails and verified wallets are finalized. The service is intentionally independent, community-supported, and relies on donations to cover hosting costs, evaluate models that lack public benchmarks, and keep the leaderboard free of vendor sponsorship.
