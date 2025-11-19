import { getVolatilityBucket } from "@/lib/historyStats";
import { DELTA_WINDOW_DAYS, getModelDelta, getModels } from "@/lib/models";
import type { Model, ModelEvidence, ModelHistoryEntry } from "@/types/model";
import type {
  EcosystemDepthSnapshot,
  TrendVelocitySnapshot,
  TransparencyComplianceSnapshot,
  V2ModelMetrics,
  V2ModelWithMetrics,
  WeightedDeltaSnapshot
} from "./types";

const DAY_MS = 1000 * 60 * 60 * 24;
const TREND_WINDOW_DAYS = 45;

export class V2ScoreEngine {
  private source: Model[];
  private cache: V2ModelWithMetrics[] | null = null;

  constructor(models: Model[] = getModels()) {
    this.source = models;
  }

  public withModels(models: Model[]): V2ScoreEngine {
    return new V2ScoreEngine(models);
  }

  public getSnapshots(): V2ModelWithMetrics[] {
    if (!this.cache) {
      this.cache = this.source.map((model) => ({
        model,
        metrics: this.computeMetrics(model)
      }));
    }
    return this.cache;
  }

  public getBySlug(slug: string): V2ModelWithMetrics | undefined {
    return this.getSnapshots().find((entry) => entry.model.slug === slug);
  }

  private computeMetrics(model: Model): V2ModelMetrics {
    const volatilityIndex = calculateVolatilityIndex(model.history);
    const trendVelocity = calculateTrendVelocity(model.history);
    const transparencyCompliance = calculateTransparencyCompliance(model);
    const ecosystemDepth = calculateEcosystemDepth(model);
    const weightedDelta = calculateWeightedDelta(model, trendVelocity, volatilityIndex);

    return {
      slug: model.slug,
      name: model.name,
      vendor: model.vendor ?? model.provider,
      total: model.total,
      volatilityIndex,
      volatilityBucket: getVolatilityBucket(model.history),
      transparencyCompliance,
      trendVelocity,
      ecosystemDepth,
      weightedDelta
    };
  }
}

export const v2ScoreEngine = new V2ScoreEngine();

function calculateVolatilityIndex(history?: ModelHistoryEntry[]): number {
  if (!history || history.length < 2) {
    return 0;
  }
  const totals = history
    .map((entry) => entry.total)
    .filter((value) => Number.isFinite(value));
  if (totals.length < 2) {
    return 0;
  }
  const mean = totals.reduce((sum, total) => sum + total, 0) / totals.length;
  const variance = totals.reduce((sum, total) => sum + Math.pow(total - mean, 2), 0) / totals.length;
  return Number(Math.sqrt(variance).toFixed(2));
}

function calculateTrendVelocity(history?: ModelHistoryEntry[], windowDays = TREND_WINDOW_DAYS): TrendVelocitySnapshot {
  if (!history || history.length < 2) {
    return {
      velocity: 0,
      windowDays,
      delta: 0,
      sampleCount: history?.length ?? 0
    };
  }
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sorted[sorted.length - 1];
  const latestTime = new Date(latest.date).getTime();
  if (Number.isNaN(latestTime)) {
    return {
      velocity: 0,
      windowDays,
      delta: 0,
      sampleCount: sorted.length
    };
  }
  const windowStart = latestTime - windowDays * DAY_MS;
  const windowEntries = sorted.filter((entry) => new Date(entry.date).getTime() >= windowStart);
  const slice = windowEntries.length >= 2 ? windowEntries : sorted.slice(-2);
  const first = slice[0];
  const last = slice[slice.length - 1];
  const firstTime = new Date(first.date).getTime();
  const lastTime = new Date(last.date).getTime();
  const daySpan = Math.max(1, (lastTime - firstTime) / DAY_MS);
  const delta = last.total - first.total;
  const perWeek = (delta / daySpan) * 7;
  return {
    velocity: Number(perWeek.toFixed(2)),
    windowDays,
    delta: Number(delta.toFixed(2)),
    sampleCount: slice.length
  };
}

function calculateTransparencyCompliance(model: Model): TransparencyComplianceSnapshot {
  const transparencyScore = model.scores.transparency ?? 0;
  const training = model.trainingDisclosureLevel ?? 0;
  const evalLevel = model.evalReproducibilityLevel ?? 0;
  const disclosureScore = training + evalLevel;
  const normalizedDisclosure = disclosureScore / 6;
  const expected = normalizedDisclosure > 0 ? normalizedDisclosure * 100 : 60;
  const ratio = expected > 0 ? Math.min(1, transparencyScore / expected) : transparencyScore / 100;
  return {
    ratio: Number(ratio.toFixed(2)),
    transparencyScore,
    disclosureScore
  };
}

function calculateEcosystemDepth(model: Model): EcosystemDepthSnapshot {
  const base = model.scores.ecosystem ?? 0;
  const adoption = model.scores.adoption ?? 0;
  const modalitiesCount = model.modalities?.length ?? (model.modality ? 1 : 0);
  const modalityBonus = Math.min(20, modalitiesCount * 4);
  const evidenceSignals = countEvidenceSignals(model.evidence);
  const coverageBonus = Math.min(25, evidenceSignals * 1.5);
  const depth = Math.min(120, base * 0.5 + adoption * 0.2 + modalityBonus + coverageBonus);
  return {
    depth: Number(depth.toFixed(1)),
    modalityBonus: Number(modalityBonus.toFixed(1)),
    coverageBonus: Number(coverageBonus.toFixed(1)),
    evidenceSignals
  };
}

function countEvidenceSignals(evidence?: ModelEvidence): number {
  if (!evidence) {
    return 0;
  }
  const bucketCounts = [
    evidence.pricing?.length ?? 0,
    evidence.benchmarks?.length ?? 0,
    evidence.safety?.length ?? 0,
    evidence.technical?.length ?? 0
  ];
  const itemCount = evidence.items?.length ?? 0;
  return bucketCounts.reduce((sum, count) => sum + count, 0) + itemCount;
}

function calculateWeightedDelta(
  model: Model,
  trend: TrendVelocitySnapshot,
  volatilityIndex: number
): WeightedDeltaSnapshot {
  const rawDelta = getModelDelta(model, DELTA_WINDOW_DAYS);
  const adoptionWeight = (model.scores.adoption ?? 0) / 100;
  const performanceWeight = (model.scores.performance ?? 0) / 100;
  const stabilityPenalty = Number(Math.max(0.55, 1 - Math.min(volatilityIndex / 10, 0.45)).toFixed(2));
  const momentumBoost = Number((trend.velocity * 0.8).toFixed(2));
  const weighted = rawDelta * (0.5 + adoptionWeight * 0.3 + performanceWeight * 0.2);
  const value = Number((weighted * stabilityPenalty + momentumBoost).toFixed(2));
  return {
    value,
    rawDelta,
    adoptionWeight: Number(adoptionWeight.toFixed(2)),
    performanceWeight: Number(performanceWeight.toFixed(2)),
    stabilityPenalty,
    momentumBoost
  };
}
