import { V4DeltaBreakdown, V4ModelComputed, V4ModelInput, V4Subscores } from "./types";

const TOTAL_WEIGHTS = {
  reasoning: 0.4,
  coding: 0.3,
  chat: 0.2,
  safety: 0.1,
} as const;

const DELTA_BASELINES = {
  reasoning: 70,
  coding: 65,
  chat: 65,
  safety: 72,
} as const;

const DELTA_SCALARS = {
  reasoning: 0.02,
  coding: 0.018,
  chat: 0.012,
  safety: 0.01,
} as const;

function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

function computeWeightedTotal(subscores: V4Subscores): number {
  const total =
    subscores.reasoning * TOTAL_WEIGHTS.reasoning +
    subscores.coding * TOTAL_WEIGHTS.coding +
    subscores.chat * TOTAL_WEIGHTS.chat +
    subscores.safety * TOTAL_WEIGHTS.safety;

  return roundScore(total);
}

export function computeDeltaBreakdown(model: V4ModelInput): V4DeltaBreakdown {
  const reasoning = roundScore(
    (model.subscores.reasoning - DELTA_BASELINES.reasoning) * DELTA_SCALARS.reasoning
  );
  const coding = roundScore((model.subscores.coding - DELTA_BASELINES.coding) * DELTA_SCALARS.coding);
  const chat = roundScore((model.subscores.chat - DELTA_BASELINES.chat) * DELTA_SCALARS.chat);
  const safety = roundScore((model.subscores.safety - DELTA_BASELINES.safety) * DELTA_SCALARS.safety);

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
  const delta30d = computeDeltaBreakdown(input);

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
