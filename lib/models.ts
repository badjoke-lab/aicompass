import modelsData from "@/data/models/index.json";
import type { Model } from "@/types/model";

export const DELTA_WINDOW_DAYS = 30;
const SPIKE_THRESHOLD = 3;

const models = modelsData as Model[];

export function getModels(): Model[] {
  return models;
}

export function getModelBySlug(slug: string): Model | undefined {
  return models.find((model) => model.slug === slug);
}

export function getSortedModels(list: Model[] = models): Model[] {
  return [...list].sort((a, b) => b.total - a.total);
}

export function getLeaderboard(limit = 10, list: Model[] = models) {
  const sorted = getSortedModels(list);
  return { leaders: sorted.slice(0, limit), rest: sorted.slice(limit) };
}

export type SpikeDirection = "up" | "down" | "waiting" | null;

export function getSpikeDirection(delta: number, waiting?: boolean): SpikeDirection {
  if (waiting) return "waiting";
  if (delta >= SPIKE_THRESHOLD) return "up";
  if (delta <= -SPIKE_THRESHOLD) return "down";
  return null;
}

export function formatDelta(delta: number): string {
  if (delta === 0) return "±0.0";
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`;
}

export function getSpikes(list: Model[] = models) {
  const active = list.filter((m) => !m.waiting);
  const gainers = active
    .filter((m) => m.delta >= SPIKE_THRESHOLD)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);
  const droppers = active
    .filter((m) => m.delta <= -SPIKE_THRESHOLD)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 3);
  return { gainers, droppers };
}

export type ModelStatusCode = "leader" | "spikeUp" | "spikeDown" | "waiting";

export function getModelStatuses(model: Model, rank?: number): ModelStatusCode[] {
  const statuses: ModelStatusCode[] = [];
  if (rank === 1) {
    statuses.push("leader");
  }
  const spike = getSpikeDirection(model.delta, model.waiting);
  if (spike === "up") {
    statuses.push("spikeUp");
  } else if (spike === "down") {
    statuses.push("spikeDown");
  } else if (spike === "waiting") {
    statuses.push("waiting");
  }
  return statuses;
}

export function getSummaryStats(list: Model[] = models) {
  const tracked = list.length;
  const waiting = list.filter((m) => m.waiting).length;
  const active = tracked - waiting;
  const avgTotal = tracked
    ? list.reduce((sum, model) => sum + model.total, 0) / tracked
    : 0;
  const leaders = getSortedModels(list);
  const leader = leaders[0] ?? null;
  const lastUpdated = getLastUpdatedDate(list);

  return {
    tracked,
    waiting,
    active,
    avgTotal,
    leader,
    lastUpdated,
    coveragePercent: tracked ? Math.round((active / tracked) * 100) : 0
  };
}

function getLastUpdatedDate(list: Model[]) {
  const timestamps = list
    .flatMap((model) => model.history ?? [])
    .map((entry) => new Date(entry.date).getTime())
    .filter((value) => !Number.isNaN(value));
  if (timestamps.length === 0) return null;
  return new Date(Math.max(...timestamps));
}
