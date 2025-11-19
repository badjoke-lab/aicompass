import { DELTA_WINDOW_DAYS, getHistoryDelta } from "@/lib/models";
import type { ModelHistoryEntry } from "@/types/model";

const DAY_MS = 1000 * 60 * 60 * 24;

export type VolatilityBucket = "stable" | "mixed" | "volatile";

export interface HistoryDerivedStats {
  delta30: number | null;
  volatility: VolatilityBucket;
  updateCount30: number;
}

export function getHistoryDerivedStats(
  history?: ModelHistoryEntry[],
  windowDays = DELTA_WINDOW_DAYS
): HistoryDerivedStats {
  return {
    delta30: getHistoryDelta(history, windowDays),
    volatility: getVolatilityBucket(history),
    updateCount30: getUpdateCount(history, windowDays)
  };
}

export function getVolatilityBucket(history?: ModelHistoryEntry[]): VolatilityBucket {
  if (!history || history.length < 2) {
    return "stable";
  }

  const totals = history
    .map((entry) => entry.total)
    .filter((value) => Number.isFinite(value));

  if (totals.length < 2) {
    return "stable";
  }

  const mean = totals.reduce((sum, total) => sum + total, 0) / totals.length;
  const variance =
    totals.reduce((sum, total) => sum + Math.pow(total - mean, 2), 0) / totals.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev < 1) return "stable";
  if (stdDev < 2.5) return "mixed";
  return "volatile";
}

export function getUpdateCount(history?: ModelHistoryEntry[], windowDays = DELTA_WINDOW_DAYS) {
  if (!history || history.length === 0) {
    return 0;
  }

  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latest = sorted[sorted.length - 1];
  const latestTime = new Date(latest.date).getTime();

  if (Number.isNaN(latestTime)) {
    return 0;
  }

  const windowStart = latestTime - windowDays * DAY_MS;
  return sorted.filter((entry) => {
    const timestamp = new Date(entry.date).getTime();
    return !Number.isNaN(timestamp) && timestamp >= windowStart;
  }).length;
}
