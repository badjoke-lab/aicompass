import { V4ModelInput, V4ModelScore } from "../types";

const TOTAL_WEIGHTS = {
  reasoning: 0.35,
  coding: 0.35,
  chat: 0.2,
  safety: 0.1,
} as const;

export function computeModelScore(input: V4ModelInput): V4ModelScore {
  const total =
    input.subscores.reasoning * TOTAL_WEIGHTS.reasoning +
    input.subscores.coding * TOTAL_WEIGHTS.coding +
    input.subscores.chat * TOTAL_WEIGHTS.chat +
    input.subscores.safety * TOTAL_WEIGHTS.safety;

  const delta30d = input.subscores.reasoning * 0.02 - input.subscores.safety * 0.01;

  return {
    ...input,
    total: Number(total.toFixed(1)),
    delta30d: Number(delta30d.toFixed(1)),
  };
}

export function computeLeaderboard(models: V4ModelInput[]): V4ModelScore[] {
  return models.map((model) => computeModelScore(model));
}
