import { computeLeaderboard as computeDevLeaderboard, computeModelScore as computeDevModelScore } from "@/lib/dev/v4/compute";
import { V4ModelInput, V4ModelScore } from "../types";

export function computeModelScore(input: V4ModelInput): V4ModelScore {
  return computeDevModelScore(input);
}

export function computeLeaderboard(models: V4ModelInput[]): V4ModelScore[] {
  return computeDevLeaderboard(models);
}
