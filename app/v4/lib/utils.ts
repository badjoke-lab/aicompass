import type { SortKey, V4Model } from "./types";

export function sortModels(models: V4Model[], key: SortKey): V4Model[] {
  const sorted = [...models];

  if (key === "total-desc") {
    return sorted.sort((a, b) => b.total - a.total);
  }

  if (key === "popularity-desc") {
    return sorted.sort((a, b) => b.popularity - a.popularity);
  }

  if (key === "recency-desc") {
    return sorted.sort((a, b) => b.recency - a.recency);
  }

  return sorted.sort((a, b) => b.credibility - a.credibility);
}
