export interface V4Evidence {
  id: string;
  source: string;
  value: number;
  note?: string;
}

export interface V4HistoryPoint {
  date: string;
  score: number;
}

export interface V4Model {
  id: string;
  name: string;
  vendor: string;
  modality: string;
  evidence: V4Evidence[];
  history: V4HistoryPoint[];
  popularity: number;
  recency: number;
  credibility: number;
  total: number;
  delta30d: number;
}

export type V4ModelWithSlug = V4Model & { slug: string };

export type V4ModelSeed = Omit<V4ModelWithSlug, "total" | "delta30d"> & {
  total?: number;
  delta30d?: number;
};
