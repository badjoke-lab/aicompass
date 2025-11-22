import modelsData from "@/data/models/index.json";
import type { Model, ModelEvidence } from "@/types/model";

const models = modelsData as Model[];

export function getModels(): Model[] {
  return models;
}

export function getModelBySlug(slug: string): Model | undefined {
  return models.find((model) => model.slug === slug);
}

export function getScores(slug: string): Model["scores"] | undefined {
  return getModelBySlug(slug)?.scores;
}

export function getEvidence(slug: string): ModelEvidence | undefined {
  return getModelBySlug(slug)?.evidence;
}
