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

export function calcDelta30(history?: ModelV4["history"]) {
  if (!history || history.length < 2) return null;
  const latest = history[history.length - 1];
  const past =
    history.find((h) => {
      const d = new Date(latest.date).getTime() - new Date(h.date).getTime();
      return d >= 1000 * 60 * 60 * 24 * 30;
    }) || history[0];
  return {
    total: latest.total - past.total,
    subscores: {
      reasoning: latest.subscores.reasoning - past.subscores.reasoning,
      coding: latest.subscores.coding - past.subscores.coding,
      math: latest.subscores.math - past.subscores.math,
      multimodal: latest.subscores.multimodal - past.subscores.multimodal,
      safety: latest.subscores.safety - past.subscores.safety,
    },
  };
}
