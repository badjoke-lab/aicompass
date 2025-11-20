# aims-v2 data model notes

This doc captures the incremental data work that prepares the AI Model Scoreboard for aims-v2 while keeping the aims-v1 UI unchanged.

## Model metadata
- `vendor` (string) – canonical company name, defaults to `provider` when missing.
- `releaseDate` (YYYY-MM or ISO) – indicates the current checkpoint.
- `modality` (string) – primary modality tag (e.g., `text`, `vision`, `vlm`).
- `parameterSize` (string) – optional descriptor such as `70B` or `1T+`.
- `trainingDisclosureLevel` (0-3) – coarse enum for transparency around training data.
- `evalReproducibilityLevel` (0-3) – coarse enum for how reproducible cited evals are.

All new fields are optional so older entries remain valid.

## Evidence structure
- `evidence.items` is a normalized array of objects with `category`, `title`, `url`, and optional `note`/`tag`.
- Categories align with the seven leaderboard metrics (performance, safety, cost, reliability, transparency, ecosystem, adoption).
- Legacy `evidence` link buckets (pricing, benchmarks, safety, technical) stay intact for the existing aims-v1 UI.

## History typing
- `history` entries now follow `ModelHistoryEntry` (`date`, `total`, optional `scores`).
- `scores` holds partial snapshots of the primary metrics so v2 charts can slice per-category deltas later.
- `getModelDelta` + `getHistoryDelta` in `lib/models.ts` translate the canonical 30-day window into a helper the UI can keep using without behavior changes.

## History extensions & internal monitor (aims-v2)
- Each tracked model now ships with 6–8 weekly checkpoints covering the last ~90 days to unblock richer charting.
- `lib/historyStats.ts` exports helpers for derived history stats:
  - `getHistoryDerivedStats` returns the 30-day delta, a volatility bucket (stable/mixed/volatile), and the update count in the current window.
  - `getVolatilityBucket` normalizes a simple standard-deviation heuristic for future reuse.
  - `getUpdateCount` isolates how many checkpoints land inside an arbitrary day window.
- `/v2/internal/history` is an operator-only view (not linked publicly) that displays each model, its derived history stats, a sparkline, and the latest checkpoints so we can audit the data powering the public leaderboard without touching the aims-v1 navigation.
