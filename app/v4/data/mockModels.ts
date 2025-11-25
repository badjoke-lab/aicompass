export type V4SubscoreKey = "quality" | "speed" | "cost" | "safety";

export type V4Evidence = {
  label: string;
  url?: string;
};

export type V4Model = {
  id: string;
  name: string;
  vendor: string;
  modality: string[];
  total: number;
  subscores: Record<V4SubscoreKey, number>;
  evidence: V4Evidence[];
  delta30d: number;
  updatedAt: string;
};

export const mockModels: V4Model[] = [
  {
    id: "orion-pro",
    name: "Orion Pro",
    vendor: "Starlance",
    modality: ["text", "vision"],
    total: 86,
    subscores: {
      quality: 24,
      speed: 22,
      cost: 18,
      safety: 22,
    },
    evidence: [
      { label: "Benchmarked on MMLU", url: "https://example.com/orion/mmlu" },
      { label: "Latency logs", url: "https://example.com/orion/latency" },
    ],
    delta30d: 4,
    updatedAt: "2024-11-05T10:00:00Z",
  },
  {
    id: "atlas-lite",
    name: "Atlas Lite",
    vendor: "Northwind",
    modality: ["text"],
    total: 78,
    subscores: {
      quality: 21,
      speed: 20,
      cost: 19,
      safety: 18,
    },
    evidence: [
      { label: "Pricing sheet", url: "https://example.com/atlas/pricing" },
      { label: "Guardrails overview", url: "https://example.com/atlas/safety" },
    ],
    delta30d: -2,
    updatedAt: "2024-11-03T08:30:00Z",
  },
  {
    id: "voyager-audio",
    name: "Voyager Audio",
    vendor: "Signal Foundry",
    modality: ["audio"],
    total: 72,
    subscores: {
      quality: 20,
      speed: 19,
      cost: 17,
      safety: 16,
    },
    evidence: [
      { label: "ASR evals", url: "https://example.com/voyager/asr" },
      { label: "Streaming demo", url: "https://example.com/voyager/demo" },
    ],
    delta30d: 6,
    updatedAt: "2024-10-30T14:15:00Z",
  },
];
