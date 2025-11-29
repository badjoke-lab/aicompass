import { computeLeaderboard } from "./compute";
import { V4ModelComputed, V4ModelInput } from "./types";

export function runScoringPipeline(models: V4ModelInput[]): V4ModelComputed[] {
  return computeLeaderboard(models);
}
