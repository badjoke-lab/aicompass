import { mockModels } from "../data/mock-models";
import type { V4ModelInput } from "../types";

export function getV4Models(): V4ModelInput[] {
  return mockModels;
}

export function getV4Model(slug: string): V4ModelInput | undefined {
  return mockModels.find((model) => model.slug === slug);
}
