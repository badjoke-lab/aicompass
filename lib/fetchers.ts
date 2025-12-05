import type { V4LeaderboardResponse, V4SnapshotResponse, V4Model } from "@/types/v4";

type ScoreResponse = { status: "ok"; score: V4Model | null };

async function resolveServerOrigin(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const { headers } = await import("next/headers");
    const headerStore = headers();
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

    if (host) {
      return `${protocol}://${host}`;
    }
  } catch (error) {
    console.error("Failed to read request headers for URL build", error);
  }

  const deploymentHost =
    typeof process !== "undefined" ? process.env.VERCEL_URL : undefined;

  if (deploymentHost) {
    const hasProtocol =
      deploymentHost.startsWith("http://") || deploymentHost.startsWith("https://");
    const protocol = deploymentHost.includes("localhost") ? "http" : "https";
    const hostWithProtocol = hasProtocol
      ? deploymentHost
      : `${protocol}://${deploymentHost}`;

    return hostWithProtocol;
  }

  return null;
}

export async function buildUrl(path: string): Promise<string> {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${normalizedPath}`;
  }

  const serverOrigin = await resolveServerOrigin();

  if (serverOrigin) {
    return `${serverOrigin}${normalizedPath}`;
  }

  return `http://localhost:3000${normalizedPath}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const url = await buildUrl(path);
  const response = await fetch(url, { cache: "no-store" });

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
  const url = await buildUrl(`/api/score/${encodeURIComponent(slug)}`);
  const response = await fetch(url, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ScoreResponse;

  return data.score ?? null;
}
