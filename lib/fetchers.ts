import type { V4LeaderboardResponse, V4SnapshotResponse, V4Model } from "@/types/v4";

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

export async function getScore(id: string): Promise<V4Model | null> {
  const data = await fetchJson<{ status: "ok"; score: V4Model | null }>(
    `/api/score?id=${encodeURIComponent(id)}`
  );

  return data.score;
}
