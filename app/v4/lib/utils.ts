import { Model, SortDirection } from './types';

export function computeTotal(model: Pick<Model, 'subscores'>): number {
  return Object.values(model.subscores).reduce((sum, value) => sum + value, 0);
}

export function computeDelta30d(model: Pick<Model, 'history'>): number {
  if (!model.history.length) return 0;

  const sorted = [...model.history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const latest = sorted[sorted.length - 1];
  const cutoff = new Date(latest.date);
  cutoff.setDate(cutoff.getDate() - 30);

  let previous = sorted[0];
  for (const entry of sorted) {
    if (new Date(entry.date) <= cutoff) {
      previous = entry;
    } else {
      break;
    }
  }

  return latest.totalScore - previous.totalScore;
}

export function sortModels(
  models: Model[],
  key: keyof Model | 'total',
  direction: SortDirection = 'asc',
): Model[] {
  const multiplier = direction === 'asc' ? 1 : -1;
  const sortableKey = key === 'total' ? 'totalScore' : key;

  return [...models].sort((a, b) => {
    const valueA = a[sortableKey as keyof Model];
    const valueB = b[sortableKey as keyof Model];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * multiplier;
    }

    const stringA = String(valueA).toLowerCase();
    const stringB = String(valueB).toLowerCase();
    return stringA.localeCompare(stringB) * multiplier;
  });
}
