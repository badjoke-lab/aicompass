import { devV4Models } from "@/data/dev/v4/models";
import { safeJSON, withError } from "@/lib/dev/v4/http";
import { runScoringPipeline } from "@/lib/dev/v4/scoring";
import type { SnapshotResponse } from "@/lib/dev/v4/types";

export const revalidate = 0;

export async function GET(): Promise<Response> {
  return withError(() => {
    const models = runScoringPipeline(devV4Models);

    return safeJSON<SnapshotResponse>({
      status: "ok",
      updated: new Date().toISOString(),
      models,
    });
  });
}
