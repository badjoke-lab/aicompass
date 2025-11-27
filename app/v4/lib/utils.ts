import type { V4ModelScore } from "../types";

export type SortKey = "total-desc";

export function sortModels(models: V4ModelScore[], key: SortKey): V4ModelScore[] {
  const sorted = [...models];
  if (key === "total-desc") {
    return sorted.sort((a, b) => b.total - a.total);
  }

  return sorted;
}
