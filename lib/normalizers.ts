import type { V4DeltaBreakdown, V4Model, V4ScoreBreakdown } from "@/types/v4";

const SCORE_MULTIPLIER = 10;

function scaleScoreBreakdown(breakdown?: V4ScoreBreakdown): V4ScoreBreakdown {
  return {
    reasoning: (breakdown?.reasoning ?? 0) * SCORE_MULTIPLIER,
    coding: (breakdown?.coding ?? 0) * SCORE_MULTIPLIER,
    chat: (breakdown?.chat ?? 0) * SCORE_MULTIPLIER,
    safety: (breakdown?.safety ?? 0) * SCORE_MULTIPLIER,
  };
}

function scaleDeltaBreakdown(delta?: V4DeltaBreakdown): V4DeltaBreakdown {
  const scaledScores = scaleScoreBreakdown(delta);

  return {
    ...scaledScores,
    total: (delta?.total ?? 0) * SCORE_MULTIPLIER,
  };
}

export function normalizeModelScores(model: V4Model): V4Model {
  return {
    ...model,
    subscores: scaleScoreBreakdown(model.subscores),
    delta30d: scaleDeltaBreakdown(model.delta30d),
    total: (model.total ?? 0) * SCORE_MULTIPLIER,
  };
}
