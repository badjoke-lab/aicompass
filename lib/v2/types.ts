import type { VolatilityBucket } from "@/lib/historyStats";
import type { Model } from "@/types/model";

export interface TrendVelocitySnapshot {
  velocity: number;
  windowDays: number;
  delta: number;
  sampleCount: number;
}

export interface TransparencyComplianceSnapshot {
  ratio: number;
  transparencyScore: number;
  disclosureScore: number;
}

export interface EcosystemDepthSnapshot {
  depth: number;
  modalityBonus: number;
  coverageBonus: number;
  evidenceSignals: number;
}

export interface WeightedDeltaSnapshot {
  value: number;
  rawDelta: number;
  adoptionWeight: number;
  performanceWeight: number;
  stabilityPenalty: number;
  momentumBoost: number;
}

export interface V2ModelMetrics {
  slug: string;
  name: string;
  vendor: string;
  total: number;
  volatilityIndex: number;
  volatilityBucket: VolatilityBucket;
  transparencyCompliance: TransparencyComplianceSnapshot;
  trendVelocity: TrendVelocitySnapshot;
  ecosystemDepth: EcosystemDepthSnapshot;
  weightedDelta: WeightedDeltaSnapshot;
}

export interface V2ModelWithMetrics {
  model: Model;
  metrics: V2ModelMetrics;
}
