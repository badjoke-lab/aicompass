import { V4ModelInput } from "@/lib/dev/v4/types";

export const devV4Models: V4ModelInput[] = [
  {
    id: "orion-pro",
    slug: "orion-pro",
    name: "Orion Pro",
    vendor: "Starlance",
    modality: ["text", "vision"],
    summary:
      "Frontier text + vision stack with strong stability; optimized for balanced reasoning depth and rollout velocity.",
    subscores: {
      reasoning: 90,
      coding: 88,
      chat: 80,
      safety: 76,
    },
    evidence: [
      { title: "Benchmarked on MMLU", url: "https://example.com/orion/mmlu", date: "2024-10-20" },
      { title: "Latency logs", url: "https://example.com/orion/latency", date: "2024-10-30" },
      { title: "Risk review", url: "https://example.com/orion/risk", date: "2024-11-01" },
    ],
    updatedAt: "2024-11-05T10:00:00Z",
    tags: ["frontier", "vision"],
  },
  {
    id: "atlas-lite",
    slug: "atlas-lite",
    name: "Atlas Lite",
    vendor: "Northwind",
    modality: ["text"],
    summary: "Latency-optimized text model with transparent pricing and gradual adoption across internal teams.",
    subscores: {
      reasoning: 84,
      coding: 76,
      chat: 72,
      safety: 78,
    },
    evidence: [
      { title: "Pricing sheet", url: "https://example.com/atlas/pricing", date: "2024-09-12" },
      { title: "Guardrails overview", url: "https://example.com/atlas/safety", date: "2024-09-28" },
    ],
    updatedAt: "2024-11-03T08:30:00Z",
    tags: ["fast"],
  },
  {
    id: "voyager-audio",
    slug: "voyager-audio",
    name: "Voyager Audio",
    vendor: "Signal Foundry",
    modality: ["audio"],
    summary: "Purpose-built audio model with reliable streaming support and fast iteration cadence.",
    subscores: {
      reasoning: 74,
      coding: 72,
      chat: 76,
      safety: 66,
    },
    evidence: [
      { title: "ASR evals", url: "https://example.com/voyager/asr", date: "2024-09-22" },
      { title: "Streaming demo", url: "https://example.com/voyager/demo", date: "2024-10-01" },
      { title: "Support SLAs", date: "2024-10-12" },
    ],
    updatedAt: "2024-10-30T14:15:00Z",
    tags: ["audio"],
  },
];
