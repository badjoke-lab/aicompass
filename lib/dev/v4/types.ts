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

export type V4DeltaBreakdown = {
  total: number;
  reasoning: number;
  coding: number;
  chat: number;
  safety: number;
};

export interface V4ModelComputed extends V4ModelInput {
  total: number;
  delta30d: V4DeltaBreakdown;
  updated: string;
}

export interface SnapshotResponse {
  status: "ok";
  updated: string | null;
  models: V4ModelComputed[];
}

export interface ScoringResponse {
  status: "ok";
  models: V4ModelComputed[];
}

export type V4Status = SnapshotResponse["status"];
