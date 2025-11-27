import type { V4ModelScore } from "../types";

export type SortKey = "total-desc" | "reasoning-desc" | "coding-desc" | "chat-desc" | "safety-desc";

export function sortModels(models: V4ModelScore[], key: SortKey): V4ModelScore[] {
  const sorted = [...models];
  if (key === "total-desc") {
    return sorted.sort((a, b) => b.total - a.total);
  }

  const field = key.replace("-desc", "") as keyof V4ModelScore["subscores"];
  return sorted.sort((a, b) => b.subscores[field] - a.subscores[field]);
}
