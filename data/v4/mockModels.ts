import { V4ModelSeed } from "../../types/v4";

export const mockModels: V4ModelSeed[] = [
  {
    id: "orion-pro",
    slug: "orion-pro",
    name: "Orion Pro",
    vendor: "Starlance",
    modality: "multimodal",
    evidence: [
      { id: "ev-orion-1", source: "Benchmarks", value: 88, note: "MMLU / vision fusion" },
      { id: "ev-orion-2", source: "Latency logs", value: 78, note: "p95 under 650ms" },
      { id: "ev-orion-3", source: "Risk review", value: 82, note: "Independent audit" },
    ],
    history: [
      { date: "2024-10-05", score: 82 },
      { date: "2024-11-05", score: 86 },
    ],
    popularity: 84,
    recency: 80,
    credibility: 81,
  },
  {
    id: "atlas-lite",
    slug: "atlas-lite",
    name: "Atlas Lite",
    vendor: "Northwind",
    modality: "text",
    evidence: [
      { id: "ev-atlas-1", source: "Pricing sheet", value: 72, note: "$0.4 / 1k tokens" },
      { id: "ev-atlas-2", source: "Guardrails overview", value: 76, note: "SOC2 controls" },
    ],
    history: [
      { date: "2024-10-03", score: 80 },
      { date: "2024-11-03", score: 78 },
    ],
    popularity: 76,
    recency: 74,
    credibility: 73,
  },
  {
    id: "voyager-audio",
    slug: "voyager-audio",
    name: "Voyager Audio",
    vendor: "Signal Foundry",
    modality: "audio",
    evidence: [
      { id: "ev-voyager-1", source: "ASR evals", value: 69, note: "WER 6.1%" },
      { id: "ev-voyager-2", source: "Streaming demo", value: 75, note: "Live captioning" },
      { id: "ev-voyager-3", source: "Support SLAs", value: 70, note: "Regional coverage" },
    ],
    history: [
      { date: "2024-10-01", score: 66 },
      { date: "2024-10-30", score: 72 },
    ],
    popularity: 70,
    recency: 72,
    credibility: 68,
  },
];
