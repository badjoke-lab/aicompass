import { mockModels } from "../../../data/v4/mockModels";
import { scoreModels } from "../../../lib/v4/scoring";
import type { V4Model } from "./types";

let cachedModels: V4Model[] | null = null;

export function getV4Models(): V4Model[] {
  if (!cachedModels) {
    cachedModels = scoreModels(mockModels);
  }

  return cachedModels;
}

export function getV4Model(slug: string): V4Model | undefined {
  return getV4Models().find((model) => model.slug === slug);
}
