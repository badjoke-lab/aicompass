import { safeJSON } from "@/lib/v4/http";
import { buildCanonicalMetadata, mergeMetadata } from "@/lib/v4/metadata";
import { V4_CONFIG } from "@/lib/v4/config";

export const revalidate = 0;

export async function GET() {
  const entries = V4_CONFIG.sources.map((source) =>
    buildCanonicalMetadata({ sourceId: source.id, payload: { modelId: "placeholder-model" } })
  );
  const metadata = mergeMetadata(entries);

  return safeJSON({
    version: "v4-metadata",
    metadata,
  });
}
