import { headers } from "next/headers";

import type { V4LeaderboardResponse, V4SnapshotResponse, V4Model } from "@/types/v4";

type ScoreResponse = { status: "ok"; score: V4Model | null };

export function buildUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  try {
    const headerStore = headers();
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

    if (host) {
      return `${protocol}://${host}${normalizedPath}`;
    }
  } catch (error) {
    console.error("Failed to read request headers for URL build", error);
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${normalizedPath}`;
  }

  return `http://localhost:3000${normalizedPath}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchSnapshot(): Promise<V4SnapshotResponse> {
  return fetchJson<V4SnapshotResponse>("/api/snapshot");
}

export async function fetchLeaderboard(): Promise<V4LeaderboardResponse> {
  return fetchJson<V4LeaderboardResponse>("/api/leaderboard");
}

export async function fetchScore(slug: string): Promise<V4Model | null> {
  const response = await fetch(buildUrl(`/api/score/${encodeURIComponent(slug)}`), { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ScoreResponse;

  return data.score ?? null;
}
