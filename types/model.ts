export interface Model {
  slug: string;
  name: string;
  provider: string;
  modalities?: string[];
  total: number;
  delta: number;
  scores: {
    performance: number;
    safety: number;
    cost: number;
    reliability: number;
    transparency: number;
    ecosystem: number;
    adoption: number;
  };
  categories?: {
    text?: number | null;
    coding?: number | null;
    vision?: number | null;
    image?: number | null;
    video?: number | null;
  };
  history?: Array<{
    date: string;
    total: number;
  }>;
  evidence?: {
    pricing?: string[];
    benchmarks?: string[];
    safety?: string[];
    technical?: string[];
  };
  waiting?: boolean;
}
