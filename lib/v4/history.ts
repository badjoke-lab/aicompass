import { V4HistoryPoint } from "../../types/v4";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function sortHistory(history: V4HistoryPoint[]): V4HistoryPoint[] {
  return [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function calculateDelta(history: V4HistoryPoint[], days = 30): number {
  if (!history || history.length === 0) return 0;

  const ordered = sortHistory(history);
  const latest = ordered[ordered.length - 1];
  const threshold = new Date(latest.date).getTime() - days * MS_PER_DAY;

  const comparison =
    ordered.find((point) => new Date(point.date).getTime() <= threshold) ??
    ordered[0];

  return Math.round((latest.score - comparison.score) * 10) / 10;
}
