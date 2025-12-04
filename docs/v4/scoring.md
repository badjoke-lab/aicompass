# V4 Scoring

Scoring v2 focuses on producing structured inputs and outputs that are easy to trace. The placeholder implementation normalizes inputs and echoes values so that downstream consumers can rely on the shape of the data before algorithms are finalized.

## Data Shapes
- **ScoreInput**: `{ modelId, metric, value, metadata? }`
- **NormalizedScoreInput**: adds `{ weight, context }` defaults.
- **ScoreOutput**: `{ modelId, metric, score, details }` for API responses.

## Pipeline
1. Accept raw inputs or fall back to the fixture from `lib/v4/config.ts`.
2. Normalize each item with default weighting and context.
3. Calculate scores using the placeholder routine (currently an identity mapping).
4. Return structured results through `/api/scoring`.

## Notes
- The module documents every stage so future algorithmic updates can slot in without changing consumers.
- Inputs and outputs intentionally avoid UI coupling and can be reused by cron jobs or background workers.
