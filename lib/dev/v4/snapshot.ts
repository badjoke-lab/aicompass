import { devV4Models } from "@/data/dev/v4/models";

import { runScoringPipeline } from "./scoring";
import type { SnapshotResponse } from "./types";

export function buildSnapshot(): SnapshotResponse {
  const models = runScoringPipeline(devV4Models);

  return {
    status: "ok",
    updated: new Date().toISOString(),
    models,
  } satisfies SnapshotResponse;
}
