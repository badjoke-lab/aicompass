import { V4_SCORE_INPUT_FIXTURE } from "./config";
import { computeLeaderboard } from "./compute";
import { V4ModelComputed, V4ModelInput } from "./types";

export interface ScoreInput {
  modelId: string;
  metric: string;
  value: number;
  metadata?: Record<string, unknown>;
}

export interface NormalizedScoreInput extends ScoreInput {
  weight: number;
  context: string;
}

export interface ScoreOutput {
  modelId: string;
  metric: string;
  score: number;
  details: Record<string, unknown>;
}

export function normalizeInputs(inputs: ScoreInput[]): NormalizedScoreInput[] {
  return inputs.map((input) => ({
    ...input,
    weight: 1,
    context: input.metadata?.context?.toString?.() ?? "baseline",
  }));
}

export function calculateScores(inputs: NormalizedScoreInput[]): ScoreOutput[] {
  return inputs.map((input) => ({
    modelId: input.modelId,
    metric: input.metric,
    score: input.value,
    details: {
      weight: input.weight,
      context: input.context,
      note: "v4 scoring placeholder",
    },
  }));
}

export function runFixtureScoringPipeline(
  inputs: ScoreInput[] = V4_SCORE_INPUT_FIXTURE
): ScoreOutput[] {
  const normalized = normalizeInputs(inputs);
  return calculateScores(normalized);
}

export function runScoringPipeline(models: V4ModelInput[]): V4ModelComputed[] {
  return computeLeaderboard(models);
}
