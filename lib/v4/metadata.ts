import { V4_CONFIG } from "./config";

export interface CanonicalMetadata {
  modelId: string;
  provider: string;
  updatedAt: string;
  tags: string[];
  extra: Record<string, unknown>;
}

export interface MetadataSource {
  sourceId: string;
  payload: Record<string, unknown>;
}

// Normalize loosely structured metadata into a canonical shape. This helper will
// be expanded to merge multiple sources and validate required attributes.
export function buildCanonicalMetadata(
  source: MetadataSource
): CanonicalMetadata {
  return {
    modelId: String(source.payload["modelId"] ?? "unknown-model"),
    provider: String(source.payload["provider"] ?? "unknown-provider"),
    updatedAt: new Date().toISOString(),
    tags: Array.isArray(source.payload["tags"])
      ? (source.payload["tags"] as string[])
      : [],
    extra: { ...source.payload, sourceId: source.sourceId },
  };
}

// Merge multiple metadata entries, preferring the latest update. This is a
// placeholder policy that will later incorporate trust scores and validation.
export function mergeMetadata(entries: CanonicalMetadata[]): CanonicalMetadata {
  const latest = entries.reduce((winner, current) => {
    if (!winner) return current;
    return winner.updatedAt > current.updatedAt ? winner : current;
  }, entries[0]);

  return {
    ...latest,
    tags: Array.from(new Set(entries.flatMap((entry) => entry.tags))),
    extra: {
      // Captures which sources contributed; useful for debugging the pipeline.
      contributingSources: entries.map((entry) => entry.extra["sourceId"]),
      configVersion: V4_CONFIG.version,
      ...latest.extra,
    },
  };
}
