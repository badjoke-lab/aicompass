import { DEV_V4_API_BASE } from "@/lib/v4/config";

import type {
  ScoringResponse,
  SnapshotResponse,
  V4DeltaBreakdown,
  V4Evidence,
  V4ModelScore,
} from "../types";

const DELTA_FALLBACK: V4DeltaBreakdown = {
  total: 0,
  reasoning: 0,
  coding: 0,
  chat: 0,
  safety: 0,
};

export async function fetchDevV4Snapshot(): Promise<SnapshotResponse | null> {
  try {
    const response = await fetch(`${DEV_V4_API_BASE}/snapshot`, { cache: "no-store" });
    if (!response.ok) return null;

    const payload = (await response.json()) as SnapshotResponse;
    return payload?.status === "ok" ? payload : null;
  } catch (error) {
    console.error("Failed to load v4 snapshot", error);
    return null;
  }
}

export async function fetchDevV4Model(id: string): Promise<V4ModelScore | null> {
  try {
    const response = await fetch(`${DEV_V4_API_BASE}/model/${id}`, { cache: "no-store" });
    if (!response.ok) return null;

    const data = (await response.json()) as ScoringResponse;
    const models = data?.status === "ok" ? (data.models as V4ModelScore[] | undefined) ?? [] : [];

    return models.find((entry) => entry.id === id || entry.slug === id) ?? null;
  } catch (error) {
    console.error(`Failed to load v4 model ${id}`, error);
    return null;
  }
}

export async function fetchDevV4Evidence(id: string): Promise<V4Evidence[]> {
  try {
    const response = await fetch(`${DEV_V4_API_BASE}/model/${id}/evidence`, { cache: "no-store" });
    if (!response.ok) return [];

    const payload = (await response.json()) as { evidence?: V4Evidence[] };
    return Array.isArray(payload.evidence) ? payload.evidence : [];
  } catch (error) {
    console.error(`Failed to load v4 evidence for ${id}`, error);
    return [];
  }
}

export function withDeltaFallback(delta: V4DeltaBreakdown | undefined): V4DeltaBreakdown {
  return delta ?? DELTA_FALLBACK;
}
