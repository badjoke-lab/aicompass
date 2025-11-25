import { mockModels, type V4Model } from "../data/mockModels";

export function getV4Models(): V4Model[] {
  return mockModels;
}

export function getV4Model(id: string): V4Model | undefined {
  return mockModels.find((model) => model.id === id);
}
