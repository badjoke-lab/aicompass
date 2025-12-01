// Central configuration for the v4 pipeline. This module centralizes constants
// so the snapshot, scoring, and metadata helpers can stay in sync even as the
// implementation evolves.

export const DEV_V4_API_BASE = "/dev/api/v4";

export type CacheStrategy = "memory-first" | "edge-revalidate" | "static";

export interface DataSource {
  id: string;
  name: string;
  endpoint: string;
  cacheTtlMinutes: number;
}

export interface V4Config {
  version: string;
  cacheStrategy: CacheStrategy;
  sources: DataSource[];
  // Placeholder for any feature flags that will be toggled as v4 matures.
  featureFlags: Record<string, boolean>;
}

// Stubbed data source definitions; these will be replaced by live adapters.
export const V4_DATA_SOURCES: DataSource[] = [
  {
    id: "benchmark-fixture",
    name: "Benchmark Fixture",
    endpoint: "https://example.com/fixtures/v4/benchmarks.json",
    cacheTtlMinutes: 30,
  },
  {
    id: "metadata-catalog",
    name: "Metadata Catalog",
    endpoint: "https://example.com/fixtures/v4/metadata.json",
    cacheTtlMinutes: 60,
  },
];

// Canonical configuration object consumed across v4 modules.
export const V4_CONFIG: V4Config = {
  version: "4.0.0-pre",
  cacheStrategy: "edge-revalidate",
  sources: V4_DATA_SOURCES,
  featureFlags: {
    scoringV2: true,
    snapshotV4: true,
  },
};

// Minimal fixture inputs that downstream modules can rely on for deterministic
// behavior during initial testing and scaffolding.
export const V4_SCORE_INPUT_FIXTURE = [
  {
    modelId: "placeholder-model",
    metric: "latency",
    value: 125,
    metadata: { unit: "ms" },
  },
  {
    modelId: "placeholder-model",
    metric: "accuracy",
    value: 0.92,
    metadata: { unit: "ratio" },
  },
];
