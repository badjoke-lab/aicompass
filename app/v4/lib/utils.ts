import { MOCK_MODELS } from "./mockModels";
import { ModelV4 } from "./types";

export function getModelById(id: string): ModelV4 | undefined {
  return MOCK_MODELS.find((model) => model.id === id);
}

export function sortByTotal(models: ModelV4[]): ModelV4[] {
  return [...models].sort((a, b) => b.total - a.total);
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
