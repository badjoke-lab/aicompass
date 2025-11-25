import { V4Model } from "../lib/types";

export const mockModels: V4Model[] = [
  {
    id: "orion-pro",
    slug: "orion-pro",
    name: "Orion Pro",
    vendor: "Starlance",
    modality: ["text", "vision"],
    total: 86,
    subscores: {
      evidence: 24,
      velocity: 22,
      adoption: 18,
      stability: 22,
    },
    summary:
      "Frontier text + vision stack with strong stability; optimized for balanced evidence quality and rollout velocity.",
    evidence: [
      { label: "Benchmarked on MMLU", url: "https://example.com/orion/mmlu", summary: "92.4% Few-shot" },
      { label: "Latency logs", url: "https://example.com/orion/latency", summary: "p95 under 650ms" },
      { label: "Risk review", url: "https://example.com/orion/risk", summary: "Independent audit" },
    ],
    delta30d: 4,
    history: [
      {
        date: "2024-10-05",
        total: 82,
        subscores: { evidence: 22, velocity: 21, adoption: 17, stability: 22 },
      },
      {
        date: "2024-11-05",
        total: 86,
        subscores: { evidence: 24, velocity: 22, adoption: 18, stability: 22 },
      },
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
    total: 78,
    subscores: {
      evidence: 21,
      velocity: 20,
      adoption: 19,
      stability: 18,
    },
    summary: "Latency-optimized text model with transparent pricing and gradual adoption across internal teams.",
    evidence: [
      { label: "Pricing sheet", url: "https://example.com/atlas/pricing", summary: "$0.4 / 1k tokens" },
      { label: "Guardrails overview", url: "https://example.com/atlas/safety", summary: "SOC2 controls" },
    ],
    delta30d: -2,
    history: [
      {
        date: "2024-10-03",
        total: 80,
        subscores: { evidence: 22, velocity: 20, adoption: 20, stability: 18 },
      },
      {
        date: "2024-11-03",
        total: 78,
        subscores: { evidence: 21, velocity: 20, adoption: 19, stability: 18 },
      },
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
    total: 72,
    subscores: {
      evidence: 20,
      velocity: 19,
      adoption: 17,
      stability: 16,
    },
    summary: "Purpose-built audio model with reliable streaming support and fast iteration cadence.",
    evidence: [
      { label: "ASR evals", url: "https://example.com/voyager/asr", summary: "WER 6.1%" },
      { label: "Streaming demo", url: "https://example.com/voyager/demo", summary: "Live captioning" },
      { label: "Support SLAs", summary: "Regional coverage" },
    ],
    delta30d: 6,
    history: [
      {
        date: "2024-10-01",
        total: 66,
        subscores: { evidence: 18, velocity: 17, adoption: 15, stability: 16 },
      },
      {
        date: "2024-10-30",
        total: 72,
        subscores: { evidence: 20, velocity: 19, adoption: 17, stability: 16 },
      },
    ],
    updatedAt: "2024-10-30T14:15:00Z",
    tags: ["audio"],
  },
];
