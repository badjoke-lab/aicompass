import { V4_SCORE_INPUT_FIXTURE } from "./config";

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

// Normalize arbitrary input into a consistent shape. Defaults are intentionally
// conservative to avoid overstating scores while the algorithm is stubbed.
export function normalizeInputs(inputs: ScoreInput[]): NormalizedScoreInput[] {
  return inputs.map((input) => ({
    ...input,
    weight: 1,
    context: input.metadata?.context?.toString?.() ?? "baseline",
  }));
}

// Placeholder scoring routine. In the future this will incorporate weighting,
// calibration curves, and benchmarking rules. For now we simply echo the value.
export function calculateScores(
  inputs: NormalizedScoreInput[]
): ScoreOutput[] {
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

// Convenience helper that threads together the full scoring pipeline from raw
// input to normalized representation and final score objects.
export function runScoringPipeline(
  inputs: ScoreInput[] = V4_SCORE_INPUT_FIXTURE
): ScoreOutput[] {
  const normalized = normalizeInputs(inputs);
  return calculateScores(normalized);
}
