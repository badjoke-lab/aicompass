import { DEV_V4_API_BASE } from "@/lib/v4/config";

import type {
  LeaderboardResponse,
  ScoringResponse,
  SnapshotResponse,
  V4DeltaBreakdown,
  V4Evidence,
  V4ModelScore,
  V4Subscores,
} from "../types";

const DELTA_FALLBACK: V4DeltaBreakdown = {
  total: 0,
  reasoning: 0,
  coding: 0,
  chat: 0,
  safety: 0,
};

const SUBSCORE_FALLBACK: V4Subscores = {
  reasoning: 0,
  coding: 0,
  chat: 0,
  safety: 0,
};

type ApiModelScore = Partial<V4ModelScore> & { updated?: string; a30d?: number };

function normalizeModel(model: ApiModelScore): V4ModelScore {
  const delta = withDeltaFallback({
    ...DELTA_FALLBACK,
    ...model?.delta30d,
    total: model?.a30d ?? model?.delta30d?.total ?? DELTA_FALLBACK.total,
  });
  const subscores = model?.subscores ?? SUBSCORE_FALLBACK;
  const evidence = Array.isArray(model?.evidence) ? model.evidence : [];
  const modality = Array.isArray(model?.modality) ? model.modality : [];
  const slug = model?.slug ?? model?.id ?? "unknown-model";
  const updatedAt = model?.updatedAt ?? model?.updated ?? "";

  return {
    ...model,
    id: model?.id ?? slug,
    slug,
    name: model?.name ?? slug,
    vendor: model?.vendor ?? "Unknown vendor",
    modality,
    total: model?.total ?? 0,
    delta30d: delta,
    subscores,
    summary: model?.summary ?? "",
    updatedAt,
    updated: updatedAt,
    evidence,
    a30d: model?.a30d ?? delta.total,
  } as V4ModelScore;
}

function normalizeModels(models: ApiModelScore[] | undefined): V4ModelScore[] {
  if (!Array.isArray(models)) return [];

  return models.map((model) => normalizeModel(model));
}

export async function fetchDevV4Snapshot(): Promise<SnapshotResponse | null> {
  try {
    const response = await fetch(`${DEV_V4_API_BASE}/leaderboard`, { cache: "no-store" });
    if (!response.ok) return null;

    const payload = (await response.json()) as LeaderboardResponse | SnapshotResponse;
    if (payload?.status !== "ok") return null;

    return {
      ...payload,
      models: normalizeModels(payload.models),
    } satisfies SnapshotResponse;
  } catch (error) {
    console.error("Failed to load v4 snapshot", error);
    return null;
  }
}

export async function fetchDevV4Model(id: string): Promise<V4ModelScore | null> {
  try {
    const response = await fetch(`${DEV_V4_API_BASE}/models/${id}`, { cache: "no-store" });
    if (!response.ok) return null;

    const data = (await response.json()) as ScoringResponse;
    const models = data?.status === "ok" ? normalizeModels(data.models) : [];

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
