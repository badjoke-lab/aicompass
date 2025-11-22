import modelsData from "@/data/models/index.json";
import { DELTA_WINDOW_DAYS } from "@/lib/models";
import type { Model, ModelEvidence } from "@/types/model";

const models = modelsData as Model[];

export const V2_DELTA_WINDOW_DAYS = DELTA_WINDOW_DAYS;

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
