import type { VolatilityBucket } from "@/lib/historyStats";
import {
  DELTA_WINDOW_DAYS,
  formatDelta,
  getModelDelta,
  getModels,
  getSortedModels,
  getSpikes,
  getSummaryStats,
  type SpikeDirection
} from "@/lib/models";
import type { Model, ModelEvidence } from "@/types/model";
import type { V2ModelWithMetrics } from "./types";
import { v2ScoreEngine } from "./scoreEngine";

interface MetadataFieldConfig {
  key:
    | "vendor"
    | "releaseDate"
    | "modality"
    | "modalities"
    | "parameterSize"
    | "trainingDisclosureLevel"
    | "evalReproducibilityLevel";
  label: string;
  weight: number;
}

interface EvidenceBucketConfig {
  key: keyof ModelEvidence;
  label: string;
  targetCount: number;
}

const METADATA_FIELDS: MetadataFieldConfig[] = [
  { key: "vendor", label: "Vendor", weight: 1 },
  { key: "releaseDate", label: "Release date", weight: 1 },
  { key: "modality", label: "Primary modality", weight: 0.8 },
  { key: "modalities", label: "Modalities list", weight: 0.6 },
  { key: "parameterSize", label: "Parameter size", weight: 1 },
  { key: "trainingDisclosureLevel", label: "Training disclosure", weight: 1 },
  { key: "evalReproducibilityLevel", label: "Eval reproducibility", weight: 1 }
];

const EVIDENCE_BUCKETS: EvidenceBucketConfig[] = [
  { key: "pricing", label: "Pricing", targetCount: 1 },
  { key: "benchmarks", label: "Benchmarks", targetCount: 2 },
  { key: "safety", label: "Safety", targetCount: 2 },
  { key: "technical", label: "Technical", targetCount: 2 },
  { key: "items", label: "Curated items", targetCount: 4 }
];

export const TRANSPARENCY_ALERT_THRESHOLD = 0.75;
const HEALTH_SCALE = 100;

export interface FieldCoverage {
  key: string;
  label: string;
  coveragePercent: number;
}

export interface MetadataCompletenessSnapshot {
  ratio: number;
  missing: string[];
  present: string[];
}

export interface EvidenceBucketScore {
  key: string;
  label: string;
  count: number;
  completeness: number;
}

export interface EvidenceCompletenessSnapshot {
  ratio: number;
  signals: number;
  buckets: EvidenceBucketScore[];
  missingBuckets: string[];
}

export interface ModelHealthSnapshot {
  slug: string;
  name: string;
  vendor: string;
  total: number;
  metadata: MetadataCompletenessSnapshot;
  evidence: EvidenceCompletenessSnapshot;
  transparencyRatio: number;
  volatilityBucket: VolatilityBucket;
  volatilityIndex: number;
  trendVelocity: V2ModelWithMetrics["metrics"]["trendVelocity"];
  weightedDelta: number;
  healthScore: number;
  spikeDirection: SpikeDirection;
  transparencyViolation: boolean;
}

export interface TrendLeader {
  slug: string;
  name: string;
  vendor: string;
  velocity: number;
  delta: number;
  history: Model["history"];
  volatilityBucket: VolatilityBucket;
}

export interface SpikeAlert {
  slug: string;
  name: string;
  vendor: string;
  deltaLabel: string;
  delta: number;
  total: number;
  direction: SpikeDirection;
}

export interface TransparencyAlert {
  slug: string;
  name: string;
  vendor: string;
  ratio: number;
  transparencyScore: number;
  disclosureScore: number;
}

export interface CompletenessSummary {
  averageRatio: number;
  coverage: FieldCoverage[];
  weakest: Array<{ slug: string; name: string; vendor: string; ratio: number; missing: string[] }>;
  strongest: Array<{ slug: string; name: string; vendor: string; ratio: number }>;
}

export interface EvidenceSummary {
  averageRatio: number;
  coverage: EvidenceBucketScore[];
  weakest: Array<{ slug: string; name: string; vendor: string; ratio: number; missingBuckets: string[] }>;
}

export interface DashboardSummary {
  generatedAt: string;
  tracked: number;
  active: number;
  waiting: number;
  coveragePercent: number;
  globalHealthScore: number;
  avgHealthScore: number;
  metadataAverage: number;
  evidenceAverage: number;
  medianTransparency: number;
  volatilityMix: Record<VolatilityBucket, number>;
}

export interface DashboardAnomalies {
  gainers: SpikeAlert[];
  droppers: SpikeAlert[];
  transparency: TransparencyAlert[];
}

export interface InternalDashboardData {
  summary: DashboardSummary;
  anomalies: DashboardAnomalies;
  modelHealth: ModelHealthSnapshot[];
  metadata: CompletenessSummary;
  evidence: EvidenceSummary;
  trendLeaders: TrendLeader[];
  trendWatch: TrendLeader[];
  metrics: V2ModelWithMetrics[];
}

let cachedDashboard: InternalDashboardData | null = null;

export function getInternalDashboardData(): InternalDashboardData {
  if (!cachedDashboard) {
    cachedDashboard = buildDashboard();
  }
  return cachedDashboard;
}

function buildDashboard(): InternalDashboardData {
  const models = getModels();
  const snapshots = v2ScoreEngine.getSnapshots();
  const summaryStats = getSummaryStats(models);
  const metadataReports = models.map((model) => ({
    model,
    report: calculateMetadataCompleteness(model)
  }));
  const evidenceReports = models.map((model) => ({
    model,
    report: calculateEvidenceCompleteness(model)
  }));

  const modelHealth = buildModelHealthRows(snapshots, metadataReports, evidenceReports);
  const metadataSummary = buildMetadataSummary(metadataReports);
  const evidenceSummary = buildEvidenceSummary(evidenceReports);
  const volatilityMix = buildVolatilityMix(snapshots);
  const transparencyValues = snapshots.map((entry) => entry.metrics.transparencyCompliance.ratio).sort((a, b) => a - b);
  const medianTransparency = getMedian(transparencyValues);

  const summary: DashboardSummary = {
    generatedAt: new Date().toISOString(),
    tracked: summaryStats.tracked,
    active: summaryStats.active,
    waiting: summaryStats.waiting,
    coveragePercent: summaryStats.coveragePercent,
    globalHealthScore: Math.round(average(modelHealth.map((row) => row.healthScore))),
    avgHealthScore: Math.round(average(modelHealth.map((row) => row.healthScore))),
    metadataAverage: roundTo(metadataSummary.averageRatio * HEALTH_SCALE, 1),
    evidenceAverage: roundTo(evidenceSummary.averageRatio * HEALTH_SCALE, 1),
    medianTransparency: roundTo(medianTransparency * 100, 1),
    volatilityMix
  };

  const spikeSets = getSpikes(models);
  const anomalies: DashboardAnomalies = {
    gainers: buildSpikeAlerts(spikeSets.gainers, "up"),
    droppers: buildSpikeAlerts(spikeSets.droppers, "down"),
    transparency: buildTransparencyAlerts(snapshots)
  };

  const { leaders, watch } = buildTrendBoards(snapshots);

  return {
    summary,
    anomalies,
    modelHealth,
    metadata: metadataSummary,
    evidence: evidenceSummary,
    trendLeaders: leaders,
    trendWatch: watch,
    metrics: snapshots
  };
}

function buildModelHealthRows(
  snapshots: V2ModelWithMetrics[],
  metadataReports: Array<{ model: Model; report: MetadataCompletenessSnapshot }>,
  evidenceReports: Array<{ model: Model; report: EvidenceCompletenessSnapshot }>
): ModelHealthSnapshot[] {
  const metadataMap = new Map(metadataReports.map(({ model, report }) => [model.slug, report] as const));
  const evidenceMap = new Map(evidenceReports.map(({ model, report }) => [model.slug, report] as const));
  const sorted = getSortedModels(snapshots.map((entry) => entry.model));
  return sorted.map((model) => {
    const metrics = snapshots.find((entry) => entry.model.slug === model.slug)?.metrics;
    if (!metrics) {
      throw new Error(`Missing v2 metrics for model ${model.slug}`);
    }
    const metadata = metadataMap.get(model.slug);
    const evidence = evidenceMap.get(model.slug);
    if (!metadata || !evidence) {
      throw new Error(`Missing completeness report for model ${model.slug}`);
    }
    const transparencyRatio = metrics.transparencyCompliance.ratio;
    const transparencyViolation = transparencyRatio < TRANSPARENCY_ALERT_THRESHOLD;
    const healthScore = computeHealthScore({
      metadataRatio: metadata.ratio,
      evidenceRatio: evidence.ratio,
      transparencyRatio,
      volatilityIndex: metrics.volatilityIndex,
      trendVelocity: metrics.trendVelocity.velocity,
      weightedDelta: metrics.weightedDelta.value
    });
    const spikeDirection = detectSpike(model);

    return {
      slug: model.slug,
      name: model.name,
      vendor: model.vendor ?? model.provider,
      total: model.total,
      metadata,
      evidence,
      transparencyRatio,
      volatilityBucket: metrics.volatilityBucket,
      volatilityIndex: metrics.volatilityIndex,
      trendVelocity: metrics.trendVelocity,
      weightedDelta: metrics.weightedDelta.value,
      healthScore,
      spikeDirection,
      transparencyViolation
    };
  });
}

function buildMetadataSummary(
  reports: Array<{ model: Model; report: MetadataCompletenessSnapshot }>
): CompletenessSummary {
  const averageRatio = average(reports.map((entry) => entry.report.ratio));
  const coverage: FieldCoverage[] = METADATA_FIELDS.map((field) => {
    const present = reports.filter(({ model }) => hasMetadataField(model, field.key)).length;
    return {
      key: field.key,
      label: field.label,
      coveragePercent: Math.round((present / Math.max(1, reports.length)) * 100)
    };
  });

  const weakest = reports
    .filter((entry) => entry.report.ratio < 0.8)
    .sort((a, b) => a.report.ratio - b.report.ratio)
    .slice(0, 4)
    .map(({ model, report }) => ({
      slug: model.slug,
      name: model.name,
      vendor: model.vendor ?? model.provider,
      ratio: roundTo(report.ratio * HEALTH_SCALE, 1),
      missing: report.missing
    }));

  const strongest = [...reports]
    .sort((a, b) => b.report.ratio - a.report.ratio)
    .slice(0, 3)
    .map(({ model, report }) => ({
      slug: model.slug,
      name: model.name,
      vendor: model.vendor ?? model.provider,
      ratio: roundTo(report.ratio * HEALTH_SCALE, 1)
    }));

  return { averageRatio, coverage, weakest, strongest };
}

function buildEvidenceSummary(
  reports: Array<{ model: Model; report: EvidenceCompletenessSnapshot }>
): EvidenceSummary {
  const averageRatio = average(reports.map((entry) => entry.report.ratio));

  const coverage: EvidenceBucketScore[] = EVIDENCE_BUCKETS.map((bucket) => {
    const bucketEntries = reports.map((entry) =>
      entry.report.buckets.find((b) => b.key === bucket.key)
    );
    const avgCount = average(bucketEntries.map((entry) => entry?.count ?? 0));
    const completenessRatio = Math.min(1, avgCount / bucket.targetCount);
    return {
      key: bucket.key,
      label: bucket.label,
      count: roundTo(avgCount, 1),
      completeness: roundTo(completenessRatio * HEALTH_SCALE, 1)
    };
  });

  const weakest = reports
    .filter((entry) => entry.report.ratio < 0.7)
    .sort((a, b) => a.report.ratio - b.report.ratio)
    .slice(0, 4)
    .map(({ model, report }) => ({
      slug: model.slug,
      name: model.name,
      vendor: model.vendor ?? model.provider,
      ratio: roundTo(report.ratio * HEALTH_SCALE, 1),
      missingBuckets: report.missingBuckets
    }));

  return { averageRatio, coverage, weakest };
}

function buildVolatilityMix(snapshots: V2ModelWithMetrics[]) {
  const mix: Record<VolatilityBucket, number> = {
    stable: 0,
    mixed: 0,
    volatile: 0
  };
  snapshots.forEach((entry) => {
    mix[entry.metrics.volatilityBucket] += 1;
  });
  return mix;
}

function buildSpikeAlerts(models: Model[], direction: SpikeDirection): SpikeAlert[] {
  return models.map((model) => ({
    slug: model.slug,
    name: model.name,
    vendor: model.vendor ?? model.provider,
    delta: getModelDelta(model),
    deltaLabel: formatDelta(getModelDelta(model)),
    total: model.total,
    direction
  }));
}

function buildTransparencyAlerts(snapshots: V2ModelWithMetrics[]): TransparencyAlert[] {
  return snapshots
    .map((entry) => ({
      slug: entry.model.slug,
      name: entry.model.name,
      vendor: entry.metrics.vendor,
      ratio: entry.metrics.transparencyCompliance.ratio,
      transparencyScore: entry.metrics.transparencyCompliance.transparencyScore,
      disclosureScore: entry.metrics.transparencyCompliance.disclosureScore
    }))
    .filter((alert) => alert.ratio < TRANSPARENCY_ALERT_THRESHOLD)
    .sort((a, b) => a.ratio - b.ratio)
    .map((alert) => ({
      ...alert,
      ratio: roundTo(alert.ratio, 2)
    }));
}

function buildTrendBoards(snapshots: V2ModelWithMetrics[]) {
  const leaders = snapshots
    .filter((entry) => entry.metrics.trendVelocity.velocity > 0.25)
    .sort((a, b) => b.metrics.trendVelocity.velocity - a.metrics.trendVelocity.velocity)
    .slice(0, 3)
    .map((entry) => toTrendLeader(entry));

  const watch = snapshots
    .filter((entry) => entry.metrics.trendVelocity.velocity < -0.2)
    .sort((a, b) => a.metrics.trendVelocity.velocity - b.metrics.trendVelocity.velocity)
    .slice(0, 3)
    .map((entry) => toTrendLeader(entry));

  return { leaders, watch };
}

function toTrendLeader(entry: V2ModelWithMetrics): TrendLeader {
  return {
    slug: entry.model.slug,
    name: entry.model.name,
    vendor: entry.metrics.vendor,
    velocity: entry.metrics.trendVelocity.velocity,
    delta: entry.metrics.trendVelocity.delta,
    history: entry.model.history,
    volatilityBucket: entry.metrics.volatilityBucket
  };
}

function calculateMetadataCompleteness(model: Model): MetadataCompletenessSnapshot {
  const totalWeight = METADATA_FIELDS.reduce((sum, field) => sum + field.weight, 0);
  let earned = 0;
  const missing: string[] = [];
  const present: string[] = [];

  METADATA_FIELDS.forEach((field) => {
    if (hasMetadataField(model, field.key)) {
      earned += field.weight;
      present.push(field.label);
    } else {
      missing.push(field.label);
    }
  });

  return {
    ratio: earned / totalWeight,
    missing,
    present
  };
}

function hasMetadataField(model: Model, key: MetadataFieldConfig["key"]): boolean {
  const value = model[key];
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0;
  }
  return Boolean(value);
}

function calculateEvidenceCompleteness(model: Model): EvidenceCompletenessSnapshot {
  const evidence = model.evidence ?? {};
  const buckets: EvidenceBucketScore[] = EVIDENCE_BUCKETS.map((bucket) => {
    const count = countEvidenceBucket(evidence[bucket.key]);
    const completeness = Math.min(1, count / bucket.targetCount);
    return {
      key: bucket.key,
      label: bucket.label,
      count,
      completeness: roundTo(completeness, 2)
    };
  });

  const ratio = average(buckets.map((bucket) => bucket.completeness));
  const missingBuckets = buckets.filter((bucket) => bucket.count === 0).map((bucket) => bucket.label);
  const signals = buckets.reduce((sum, bucket) => sum + bucket.count, 0);

  return {
    ratio,
    signals,
    buckets,
    missingBuckets
  };
}

function countEvidenceBucket(value: ModelEvidence[keyof ModelEvidence] | undefined): number {
  if (!value) {
    return 0;
  }
  if (Array.isArray(value)) {
    return value.length;
  }
  return 0;
}

function detectSpike(model: Model): SpikeDirection {
  const delta = getModelDelta(model, DELTA_WINDOW_DAYS);
  if (model.waiting) {
    return "waiting";
  }
  if (delta >= 3) {
    return "up";
  }
  if (delta <= -3) {
    return "down";
  }
  return null;
}

function computeHealthScore({
  metadataRatio,
  evidenceRatio,
  transparencyRatio,
  volatilityIndex,
  trendVelocity,
  weightedDelta
}: {
  metadataRatio: number;
  evidenceRatio: number;
  transparencyRatio: number;
  volatilityIndex: number;
  trendVelocity: number;
  weightedDelta: number;
}): number {
  const stabilityScore = 1 - Math.min(volatilityIndex / 6, 1);
  const trendScore = clamp((trendVelocity + 2) / 6, 0, 1);
  const deltaScore = clamp((weightedDelta + 8) / 16, 0, 1);

  const total =
    metadataRatio * 0.32 +
    evidenceRatio * 0.2 +
    transparencyRatio * 0.2 +
    stabilityScore * 0.15 +
    trendScore * 0.08 +
    deltaScore * 0.05;

  return Math.round(clamp(total, 0, 1) * HEALTH_SCALE);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getMedian(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const middle = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[middle - 1] + values[middle]) / 2;
  }
  return values[middle];
}
