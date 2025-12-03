import type { V4LeaderboardResponse, V4SnapshotResponse, V4Model } from "@/types/v4";

type ScoreResponse = { status: "ok"; score: V4Model | null };

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getSnapshot(): Promise<V4SnapshotResponse> {
  return fetchJson<V4SnapshotResponse>("/api/snapshot");
}

export async function getLeaderboard(): Promise<V4LeaderboardResponse> {
  return fetchJson<V4LeaderboardResponse>("/api/leaderboard");
}

export async function getScore(slug: string): Promise<V4Model | null> {
  const response = await fetch(`/api/score?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ScoreResponse;

  return data.score ?? null;
}
