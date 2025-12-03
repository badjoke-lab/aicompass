import type {
  LeaderboardResponse,
  ScoringResponse,
  SnapshotResponse,
  V4ModelEntry,
} from "@/lib/v4/types";

const updated = "2024-11-15T15:00:00Z";

const models: V4ModelEntry[] = [
  {
    id: "orion-pro",
    slug: "orion-pro",
    name: "Orion Pro",
    vendor: "Starlance",
    modality: ["text", "code"],
    summary:
      "Starlance's flagship reasoning model tuned for copilots and long-context planning with strong grounding.",
    subscores: {
      reasoning: 96.4,
      coding: 94.2,
      chat: 95.1,
      safety: 92.3,
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
    updatedAt: "2024-11-15T15:00:00Z",
    tags: ["enterprise", "assistant"],
    total: 95.2,
    delta30d: {
      total: 2.1,
      reasoning: 1.2,
      coding: 1.0,
      chat: 1.4,
      safety: 0.8,
    },
  },
  {
    id: "model-aurora-lite",
    slug: "aurora-lite",
    name: "Aurora Lite",
    vendor: "Northwind",
    modality: ["text"],
    summary: "Lightweight chat model tuned for latency-sensitive workloads.",
    subscores: {
      reasoning: 86.5,
      coding: 82.1,
      chat: 88.3,
      safety: 90.1,
    },
    evidence: [
      {
        title: "Latency comparison",
        url: "https://example.com/aurora-lite/latency",
        date: "2024-05-22",
      },
    ],
    updatedAt: "2024-11-12T09:30:00Z",
    tags: ["lightweight", "chat"],
    total: 88.1,
    delta30d: {
      total: 0.8,
      reasoning: 0.5,
      coding: 0.2,
      chat: 0.6,
      safety: 0.3,
    },
  },
  {
    id: "model-helix-research",
    slug: "helix-research",
    name: "Helix Research",
    vendor: "Helix Labs",
    modality: ["text", "vision"],
    summary: "Multimodal research preview with strong coding and reasoning.",
    subscores: {
      reasoning: 90.7,
      coding: 92.9,
      chat: 87.2,
      safety: 86.4,
    },
    evidence: [
      {
        title: "Multimodal QA eval",
        url: "https://example.com/helix-research/qa",
        date: "2024-05-27",
      },
    ],
    updatedAt: "2024-11-08T15:45:00Z",
    tags: ["research", "multimodal"],
    total: 90.1,
    delta30d: {
      total: 1.1,
      reasoning: 0.7,
      coding: 0.9,
      chat: 0.4,
      safety: 0.2,
    },
  },
];

export function buildSnapshotPayload(): SnapshotResponse {
  return {
    status: "ok",
    updated,
    models,
  };
}

export function buildLeaderboardPayload(): LeaderboardResponse {
  return {
    status: "ok",
    updated,
    leaderboard: [...models].sort((a, b) => b.total - a.total),
  };
}

export function buildScoringPayload(slug: string): ScoringResponse {
  const model = models.find((entry) => entry.slug === slug) ?? null;

  return {
    status: "ok",
    updated,
    model,
  };
}
