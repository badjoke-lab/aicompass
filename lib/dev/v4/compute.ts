import { V4DeltaBreakdown, V4ModelComputed, V4ModelInput, V4Subscores } from "./types";

const TOTAL_WEIGHTS = {
  reasoning: 0.45,
  coding: 0.25,
  chat: 0.2,
  safety: 0.1,
} as const;

function computeWeightedTotal(subscores: V4Subscores): number {
  const total =
    subscores.reasoning * TOTAL_WEIGHTS.reasoning +
    subscores.coding * TOTAL_WEIGHTS.coding +
    subscores.chat * TOTAL_WEIGHTS.chat +
    subscores.safety * TOTAL_WEIGHTS.safety;

  return Number(total.toFixed(1));
}

export function generateMockHistory(model: V4ModelInput): V4DeltaBreakdown {
  const reasoning = Number((model.subscores.reasoning * 0.02).toFixed(1));
  const coding = Number((model.subscores.coding * 0.02).toFixed(1));
  const chat = Number((model.subscores.chat * 0.02).toFixed(1));
  const safety = Number((-model.subscores.safety * 0.01).toFixed(1));

  const total = computeWeightedTotal({ reasoning, coding, chat, safety });

  return {
    total,
    reasoning,
    coding,
    chat,
    safety,
  };
}

export function computeModelScore(input: V4ModelInput): V4ModelComputed {
  const total = computeWeightedTotal(input.subscores);
  const delta30d = generateMockHistory(input);

  return {
    ...input,
    total,
    delta30d,
    updated: input.updatedAt,
  };
}

export function computeLeaderboard(models: V4ModelInput[]): V4ModelComputed[] {
  return models.map((model) => computeModelScore(model));
}
