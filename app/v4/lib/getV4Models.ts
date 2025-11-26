import { mockModels } from "../data/mockModels";
import type { V4Model } from "./types";

export function getV4Models(): V4Model[] {
  return mockModels;
}

export function getV4Model(slug: string): V4Model | undefined {
  return mockModels.find((model) => model.slug === slug);
}
