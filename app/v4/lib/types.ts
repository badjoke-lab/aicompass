export type V4Modality = "text" | "image" | "audio" | "video" | "vision" | "multimodal";

export type V4SubscoreKey = "evidence" | "velocity" | "adoption" | "stability";

export type V4Subscores = Record<V4SubscoreKey, number>;

export type V4Evidence = {
  label: string;
  url?: string;
  summary?: string;
  lastUpdated?: string;
};

export type V4HistoryPoint = {
  date: string; // ISO day
  total: number;
  subscores: V4Subscores;
};

export type V4Model = {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  modality: V4Modality[];
  total: number;
  subscores: V4Subscores;
  summary: string;
  evidence: V4Evidence[];
  delta30d?: number;
  history?: V4HistoryPoint[];
  updatedAt: string;
  tags?: string[];
};
