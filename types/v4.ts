export type V4ScoreBreakdown = {
  reasoning: number;
  coding: number;
  chat: number;
  safety: number;
};

export interface V4Model {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  modality: string[];
  summary: string;
  subscores: V4ScoreBreakdown;
  evidence: { title: string; url?: string; date: string }[];
  updated: string;
  tags: string[];
  total: number;
  delta30d: V4ScoreBreakdown & { total: number };
}

export interface V4SnapshotResponse {
  status: "ok";
  updated: string;
  models: V4Model[];
}

export interface V4LeaderboardResponse {
  status: "ok";
  updated: string;
  leaderboard: V4Model[];
}
