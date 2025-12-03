export type V4ScoreBreakdown = {
  reasoning: number;
  coding: number;
  chat: number;
  safety: number;
};

export type V4DeltaBreakdown = V4ScoreBreakdown & {
  total: number;
};

export interface V4Model {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  modality: string[];
  summary: string;
  subscores: V4ScoreBreakdown;
  evidence: { title: string; url: string; date: string }[];
  updatedAt: string;
  tags: string[];
  total: number;
  delta30d: V4DeltaBreakdown;
}

export interface V4SnapshotResponse {
  status: "ok";
  models: V4Model[];
}

export interface V4LeaderboardResponse {
  status: "ok";
  leaderboard: V4Model[];
}
