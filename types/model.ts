export interface Model {
  id: string;
  name: string;
  provider: string;
  total: number;
  delta: number;
  scores: {
    performance: number;
    safety: number;
    cost: number;
    transparency: number;
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
