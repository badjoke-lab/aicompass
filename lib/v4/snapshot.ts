import { V4_CONFIG, V4_SCORE_INPUT_FIXTURE } from "./config";
import { buildCanonicalMetadata, mergeMetadata } from "./metadata";
import { runScoringPipeline, ScoreOutput } from "./scoring";

export interface SnapshotRunOptions {
  refresh?: boolean;
  requestedBy?: string;
}

export interface SnapshotRecord {
  modelId: string;
  scores: ScoreOutput[];
  metadata: ReturnType<typeof buildCanonicalMetadata>;
}

export interface SnapshotResponse {
  generatedAt: string;
  source: string;
  records: SnapshotRecord[];
  configVersion: string;
}

// Build a stable snapshot payload using the scoring and metadata helpers. The
// logic currently uses fixture data but mirrors the eventual data flow.
export async function buildSnapshot(
  options: SnapshotRunOptions = {}
): Promise<SnapshotResponse> {
  const scores = runScoringPipeline(V4_SCORE_INPUT_FIXTURE);

  // In a future iteration we will aggregate metadata from external sources. For
  // now we simulate the merge logic with a single placeholder source.
  const metadata = mergeMetadata(
    V4_CONFIG.sources.map((source) =>
      buildCanonicalMetadata({
        sourceId: source.id,
        payload: {
          modelId: "placeholder-model",
          provider: "fixture-provider",
          sourceEndpoint: source.endpoint,
        },
      })
    )
  );

  const records: SnapshotRecord[] = [
    {
      modelId: "placeholder-model",
      scores,
      metadata,
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    source: options.refresh ? "refresh" : "cache",
    records,
    configVersion: V4_CONFIG.version,
  };
}

// Lightweight accessor for cached snapshots. Currently delegates to build a new
// snapshot to guarantee deterministic outputs while storage is not configured.
export async function getSnapshot(): Promise<SnapshotResponse> {
  return buildSnapshot({ refresh: false });
}

// Force a fresh snapshot run. This will later trigger actual ingestion and
// scoring flows but presently returns the same structure with a different
// source marker.
export async function refreshSnapshot(): Promise<SnapshotResponse> {
  return buildSnapshot({ refresh: true });
}
