import type {
  LeaderboardResponse,
  ScoringResponse,
  SnapshotResponse,
  V4ModelEntry,
} from "@/lib/v4/types";

const updated = "2024-06-05T12:00:00Z";

const models: V4ModelEntry[] = [
  {
    id: "model-orion-pro",
    slug: "orion-pro",
    name: "Orion Pro",
    vendor: "Orion Labs",
    modality: ["text", "code"],
    summary: "Flagship reasoning-tuned assistant optimized for enterprise copilots.",
    subscores: {
      reasoning: 94.2,
      coding: 91.8,
      chat: 93.6,
      safety: 89.9,
    },
    evidence: [
      {
        title: "ARC-AGI benchmark (May)",
        url: "https://example.com/orion-pro/arc",
        date: "2024-05-18",
      },
      {
        title: "Enterprise deployment case study",
        url: "https://example.com/orion-pro/case-study",
        date: "2024-05-30",
      },
    ],
    updatedAt: "2024-06-05T12:00:00Z",
    tags: ["enterprise", "assistant"],
    total: 92.4,
    delta30d: {
      total: 1.6,
      reasoning: 0.9,
      coding: 0.7,
      chat: 1.1,
      safety: 0.4,
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
    updatedAt: "2024-06-02T09:30:00Z",
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
    updatedAt: "2024-06-03T15:45:00Z",
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
