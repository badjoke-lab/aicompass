export interface V4ErrorResponse {
  status: "error";
  message: string;
}

export interface SnapshotResponse {
  status: "ok";
  updated: string | null;
  models: V4ModelEntry[];
}

export interface LeaderboardResponse {
  status: "ok";
  updated: string | null;
  leaderboard: V4ModelEntry[];
}

export interface ScoringResponse {
  status: "ok";
  updated: string | null;
  model: V4ModelEntry | null;
}

export interface V4ModelEntry {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  modality: string[];
  summary: string;
  subscores: {
    reasoning: number;
    coding: number;
    chat: number;
    safety: number;
  };
  evidence: { title: string; url?: string; date: string }[];
  updatedAt: string;
  tags: string[];
  total: number;
  delta30d: {
    total: number;
    reasoning: number;
    coding: number;
    chat: number;
    safety: number;
  };
}
