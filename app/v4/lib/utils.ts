import type { V4Model, V4SubscoreKey } from "./types";

export type SortKey = "total-desc" | `${V4SubscoreKey}-desc`;

export function sortModels(models: V4Model[], key: SortKey): V4Model[] {
  const sorted = [...models];
  if (key === "total-desc") {
    return sorted.sort((a, b) => b.total - a.total);
  }

  const field = key.replace("-desc", "") as V4SubscoreKey;
  return sorted.sort((a, b) => b.subscores[field] - a.subscores[field]);
}

export function calcDelta30(history?: V4Model["history"]) {
  if (!history || history.length === 0) return null;
  if (history.length === 1) {
    return { total: 0, subscores: history[0].subscores };
  }

  const latest = history[history.length - 1];
  const target =
    history.find((point) => {
      const days = (new Date(latest.date).getTime() - new Date(point.date).getTime()) / (1000 * 60 * 60 * 24);
      return days >= 30;
    }) || history[0];

  return {
    total: latest.total - target.total,
    subscores: {
      evidence: latest.subscores.evidence - target.subscores.evidence,
      velocity: latest.subscores.velocity - target.subscores.velocity,
      adoption: latest.subscores.adoption - target.subscores.adoption,
      stability: latest.subscores.stability - target.subscores.stability,
    },
  };
}
