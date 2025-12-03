import type { V4LeaderboardResponse, V4Model, V4SnapshotResponse } from "@/types/v4";

const updated = "2024-11-15T15:00:00Z";

const models: V4Model[] = [
  {
    id: "orion-pro",
    slug: "orion-pro",
    name: "Orion Pro",
    vendor: "Starlance",
    modality: ["text", "code"],
    summary: "Flagship reasoning model tuned for copilots and long-context planning.",
    subscores: {
      reasoning: 9.6,
      coding: 9.4,
      chat: 9.5,
      safety: 9.2,
    },
    evidence: [
      {
        title: "Starlance Orion Pro v4 eval: ARC-AGI (Oct 2024)",
        url: "https://example.com/orion-pro/arc-oct-2024",
        date: "2024-10-28",
      },
      {
        title: "Enterprise copilots rollout (1.2M requests/day)",
        url: "https://example.com/orion-pro/copilot-scale",
        date: "2024-11-10",
      },
    ],
    updated,
    tags: ["enterprise", "assistant"],
    total: 9.5,
    delta30d: {
      total: 0.4,
      reasoning: 0.3,
      coding: 0.3,
      chat: 0.4,
      safety: 0.2,
    },
  },
  {
    id: "aurora-lite",
    slug: "aurora-lite",
    name: "Aurora Lite",
    vendor: "Northwind",
    modality: ["text"],
    summary: "Lightweight chat model tuned for latency-sensitive workloads.",
    subscores: {
      reasoning: 8.6,
      coding: 8.2,
      chat: 8.8,
      safety: 9.0,
    },
    evidence: [
      {
        title: "Latency comparison",
        url: "https://example.com/aurora-lite/latency",
        date: "2024-05-22",
      },
    ],
    updated: "2024-11-12T09:30:00Z",
    tags: ["lightweight", "chat"],
    total: 8.8,
    delta30d: {
      total: 0.2,
      reasoning: 0.1,
      coding: 0.1,
      chat: 0.2,
      safety: 0.1,
    },
  },
  {
    id: "helix-research",
    slug: "helix-research",
    name: "Helix Research",
    vendor: "Helix Labs",
    modality: ["text", "vision"],
    summary: "Multimodal research preview with strong coding and reasoning.",
    subscores: {
      reasoning: 9.1,
      coding: 9.3,
      chat: 8.7,
      safety: 8.6,
    },
    evidence: [
      {
        title: "Multimodal QA eval",
        url: "https://example.com/helix-research/qa",
        date: "2024-05-27",
      },
    ],
    updated: "2024-11-08T15:45:00Z",
    tags: ["research", "multimodal"],
    total: 9.0,
    delta30d: {
      total: 0.3,
      reasoning: 0.2,
      coding: 0.3,
      chat: 0.1,
      safety: 0.1,
    },
  },
];

export function buildSnapshotPayload(): V4SnapshotResponse {
  return {
    status: "ok",
    updated,
    models,
  };
}

export function buildLeaderboardPayload(): V4LeaderboardResponse {
  return {
    status: "ok",
    updated,
    leaderboard: [...models].sort((a, b) => b.total - a.total),
  };
}

export function buildScorePayload(id: string) {
  return {
    status: "ok" as const,
    updated,
    model: models.find((model) => model.id === id || model.slug === id) ?? null,
  };
}
