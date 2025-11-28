import { V4ModelSeed, V4ModelWithSlug } from "../../types/v4";
import { calculateCredibilityFromEvidence } from "./evidence";
import { calculateDelta, sortHistory } from "./history";

const VENDOR_WEIGHTS: Record<string, number> = {
  Starlance: 1.06,
  Northwind: 1.02,
  "Signal Foundry": 0.98,
};

const MODALITY_WEIGHTS: Record<string, number> = {
  text: 1,
  vision: 1.05,
  audio: 0.97,
  video: 1.04,
  multimodal: 1.08,
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getVendorWeight(vendor: string): number {
  return VENDOR_WEIGHTS[vendor] ?? 1;
}

export function getModalityWeight(modality: string): number {
  return MODALITY_WEIGHTS[modality] ?? 1;
}

export function calculateSubscores(seed: V4ModelSeed) {
  const vendorWeight = getVendorWeight(seed.vendor);
  const modalityWeight = getModalityWeight(seed.modality);

  const popularity = clampScore(seed.popularity * vendorWeight);

  const orderedHistory = sortHistory(seed.history);
  const latestHistoryScore = orderedHistory[orderedHistory.length - 1]?.score;
  const recencyBaseline = latestHistoryScore ?? seed.recency;
  const recency = clampScore((seed.recency * 0.6 + recencyBaseline * 0.4) * modalityWeight);

  const credibilityFromEvidence = calculateCredibilityFromEvidence(
    seed.credibility,
    seed.evidence
  );
  const credibility = clampScore(credibilityFromEvidence * vendorWeight);

  return { popularity, recency, credibility };
}

export function calculateTotalScore(subscores: {
  popularity: number;
  recency: number;
  credibility: number;
}): number {
  const rawTotal =
    subscores.popularity * 0.4 + subscores.recency * 0.3 + subscores.credibility * 0.3;

  return Math.round(rawTotal * 10) / 10;
}

export function scoreModel(seed: V4ModelSeed): V4ModelWithSlug {
  const subscores = calculateSubscores(seed);
  const delta30d = calculateDelta(seed.history, 30);
  const total = calculateTotalScore(subscores);

  return {
    ...seed,
    popularity: subscores.popularity,
    recency: subscores.recency,
    credibility: subscores.credibility,
    total,
    delta30d,
    history: sortHistory(seed.history),
  };
}

export function scoreModels(seeds: V4ModelSeed[]): V4ModelWithSlug[] {
  return seeds.map(scoreModel);
}
