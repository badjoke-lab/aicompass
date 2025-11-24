import { MOCK_MODELS } from "./mockModels";
import { ModelV4 } from "./types";

export function getModelById(id: string): ModelV4 | undefined {
  return MOCK_MODELS.find((model) => model.id === id);
}

export function sortByTotal(models: ModelV4[]): ModelV4[] {
  return [...models].sort((a, b) => b.total - a.total);
}

export type SortKey =
  | "total-desc"
  | "reasoning-desc"
  | "coding-desc"
  | "math-desc"
  | "multimodal-desc"
  | "safety-desc";

export function sortModels(models: ModelV4[], key: SortKey): ModelV4[] {
  const m = [...models];
  const by = (fn: (x: ModelV4) => number) => m.sort((a, b) => fn(b) - fn(a));
  switch (key) {
    case "reasoning-desc":
      return by((x) => x.subscores.reasoning);
    case "coding-desc":
      return by((x) => x.subscores.coding);
    case "math-desc":
      return by((x) => x.subscores.math);
    case "multimodal-desc":
      return by((x) => x.subscores.multimodal);
    case "safety-desc":
      return by((x) => x.subscores.safety);
    default:
      return by((x) => x.total);
  }
}

export function calcDelta30d(model: ModelV4): number {
  if (!model.history30d.length) return 0;

  const sortedHistory = [...model.history30d].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const first = sortedHistory[0];
  const last = sortedHistory[sortedHistory.length - 1];

  return last.total - first.total;
}
