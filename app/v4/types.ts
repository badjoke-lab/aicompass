export type V4Modality = "text" | "image" | "audio" | "video" | "vision" | "multimodal";

export type V4Evidence = {
  title: string;
  url?: string;
  date?: string;
  summary?: string;
};

export type V4Subscores = {
  reasoning: number;
  coding: number;
  chat: number;
  safety: number;
};

export interface V4ModelInput {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  modality: V4Modality[];
  summary: string;
  subscores: V4Subscores;
  evidence: V4Evidence[];
  updatedAt: string;
  tags?: string[];
}

export interface V4ModelScore extends V4ModelInput {
  total: number;
  delta30d: number;
}
