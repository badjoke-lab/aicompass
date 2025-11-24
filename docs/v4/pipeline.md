# V4 Pipeline

The v4 pipeline is organized around modular helpers in `lib/v4/*`. Each module is intentionally lightweight and returns stubbed values until the live ingestion and scoring logic is finalized.

## Components
- **Config (`lib/v4/config.ts`)**: Defines cache strategy, data sources, and fixture inputs that keep the pipeline deterministic.
- **Metadata (`lib/v4/metadata.ts`)**: Normalizes raw metadata into a canonical shape and merges multiple entries while tracking contributing sources.
- **Scoring (`lib/v4/scoring.ts`)**: Normalizes raw inputs, applies placeholder scoring, and returns structured score objects.
- **Snapshot (`lib/v4/snapshot.ts`)**: Coordinates scoring and metadata to build a snapshot payload with minimal dependencies.

## Flow
1. Load configuration to identify sources and feature flags.
2. Gather metadata from sources and normalize into a canonical form.
3. Normalize scoring inputs and compute placeholder scores.
4. Assemble snapshot records and return JSON through `/api/v4/snapshot` or `/api/v4/snapshot/refresh`.

## Caching Strategy
The cache strategy is currently declared as `edge-revalidate` and can be swapped without changing consumer modules. Actual cache hooks will be wired once storage backends are selected.
