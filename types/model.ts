export type ScoreCategoryKey =
  | "performance"
  | "safety"
  | "cost"
  | "reliability"
  | "transparency"
  | "ecosystem"
  | "adoption";

export type DisclosureLevel = 0 | 1 | 2 | 3;

export interface ModelScoreBreakdown {
  performance: number;
  safety: number;
  cost: number;
  reliability: number;
  transparency: number;
  ecosystem: number;
  adoption: number;
}

export interface ModelHistoryEntry {
  date: string;
  total: number;
  scores?: Partial<ModelScoreBreakdown>;
}

export interface ModelEvidenceItem {
  category: ScoreCategoryKey;
  title: string;
  url: string;
  note?: string;
  tag?: string;
}

export interface ModelEvidence {
  pricing?: string[];
  benchmarks?: string[];
  safety?: string[];
  technical?: string[];
  items?: ModelEvidenceItem[];
}

export interface Model {
  slug: string;
  name: string;
  provider: string;
  vendor?: string;
  releaseDate?: string;
  modality?: string;
  modalities?: string[];
  parameterSize?: string;
  trainingDisclosureLevel?: DisclosureLevel;
  evalReproducibilityLevel?: DisclosureLevel;
  total: number;
  delta: number;
  scores: ModelScoreBreakdown;
  categories?: {
    text?: number | null;
    coding?: number | null;
    vision?: number | null;
    image?: number | null;
    video?: number | null;
  };
  history?: ModelHistoryEntry[];
  evidence?: ModelEvidence;
  waiting?: boolean;
}
