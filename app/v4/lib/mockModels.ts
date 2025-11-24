import { ModelV4 } from "./types";

export const MOCK_MODELS: ModelV4[] = [
  {
    id: "gpt-5",
    name: "GPT-5",
    vendor: { id: "openai", name: "OpenAI" },
    modality: ["text", "multimodal"],
    total: 96,
    subscores: {
      reasoning: 97,
      coding: 95,
      math: 96,
      multimodal: 94,
      safety: 90,
    },
    evidence: [
      {
        label: "MMLU v1.1",
        url: "https://openai.com/research/mmlu-gpt5",
        score: 93.8,
        note: "Few-shot benchmark run",
        updatedAt: "2024-07-22",
      },
      {
        label: "HumanEval+",
        url: "https://openai.com/blog/humaneval-plus-gpt5",
        score: 92.1,
        note: "Pass@1",
        updatedAt: "2024-07-18",
      },
      {
        label: "Red teaming report",
        url: "https://openai.com/safety/gpt5-redteam",
        note: "Third-party audit",
        updatedAt: "2024-07-10",
      },
    ],
    history30d: [
      {
        date: "2024-06-25",
        total: 93,
        subscores: { reasoning: 95, coding: 92, math: 93, multimodal: 90, safety: 88 },
      },
      {
        date: "2024-07-10",
        total: 95,
        subscores: { reasoning: 96, coding: 94, math: 95, multimodal: 92, safety: 89 },
      },
      {
        date: "2024-07-22",
        total: 96,
        subscores: { reasoning: 97, coding: 95, math: 96, multimodal: 94, safety: 90 },
      },
    ],
    updatedAt: "2024-07-22",
    tags: ["flagship", "frontier"],
  },
  {
    id: "atlas-pro",
    name: "Atlas Pro",
    vendor: { id: "anthropic", name: "Anthropic" },
    modality: ["text"],
    total: 92,
    subscores: {
      reasoning: 93,
      coding: 90,
      math: 91,
      multimodal: 0,
      safety: 94,
    },
    evidence: [
      {
        label: "Safety certification",
        url: "https://anthropic.com/safety/atlas-pro",
        note: "External audit summary",
        updatedAt: "2024-07-05",
      },
      {
        label: "ARC-AGI",
        url: "https://benchmarks.anthropic.com/arc-agi",
        score: 89.5,
        updatedAt: "2024-07-15",
      },
    ],
    history30d: [
      {
        date: "2024-06-23",
        total: 90,
        subscores: { reasoning: 91, coding: 88, math: 89, multimodal: 0, safety: 93 },
      },
      {
        date: "2024-07-18",
        total: 92,
        subscores: { reasoning: 93, coding: 90, math: 91, multimodal: 0, safety: 94 },
      },
    ],
    updatedAt: "2024-07-18",
  },
  {
    id: "sakura-vision",
    name: "Sakura Vision",
    vendor: { id: "sakura", name: "Sakura AI" },
    modality: ["image", "multimodal"],
    total: 85,
    subscores: {
      reasoning: 80,
      coding: 72,
      math: 76,
      multimodal: 88,
      safety: 82,
    },
    evidence: [
      {
        label: "ImageNet v4",
        url: "https://sakura.ai/research/imagenet-v4",
        score: 91.2,
        updatedAt: "2024-07-12",
      },
      {
        label: "COCO captioning",
        url: "https://sakura.ai/benchmarks/coco-captioning",
        note: "BLEU-4 43.1",
        updatedAt: "2024-07-02",
      },
    ],
    history30d: [
      {
        date: "2024-06-26",
        total: 82,
        subscores: { reasoning: 77, coding: 70, math: 72, multimodal: 85, safety: 80 },
      },
      {
        date: "2024-07-20",
        total: 85,
        subscores: { reasoning: 80, coding: 72, math: 76, multimodal: 88, safety: 82 },
      },
    ],
    updatedAt: "2024-07-20",
    tags: ["vision"],
  },
  {
    id: "northwind-voice",
    name: "Northwind Voice",
    vendor: { id: "northwind", name: "Northwind" },
    modality: ["audio", "text"],
    total: 78,
    subscores: {
      reasoning: 74,
      coding: 65,
      math: 68,
      multimodal: 70,
      safety: 81,
    },
    evidence: [
      {
        label: "Streaming ASR latency",
        url: "https://northwind.ai/status/asr-latency",
        note: "p95 under 300ms",
        updatedAt: "2024-07-11",
      },
      {
        label: "SpeechBench",
        url: "https://northwind.ai/benchmarks/speechbench",
        score: 78.4,
        updatedAt: "2024-07-08",
      },
    ],
    history30d: [
      {
        date: "2024-06-24",
        total: 74,
        subscores: { reasoning: 70, coding: 63, math: 64, multimodal: 68, safety: 79 },
      },
      {
        date: "2024-07-21",
        total: 78,
        subscores: { reasoning: 74, coding: 65, math: 68, multimodal: 70, safety: 81 },
      },
    ],
    updatedAt: "2024-07-21",
  },
  {
    id: "tempo-lite",
    name: "Tempo Lite",
    vendor: { id: "quickai", name: "QuickAI" },
    modality: ["text"],
    total: 74,
    subscores: {
      reasoning: 68,
      coding: 66,
      math: 64,
      multimodal: 50,
      safety: 80,
    },
    evidence: [
      {
        label: "Latency showcase",
        url: "https://quickai.dev/blog/tempo-lite-edge",
        note: "Edge optimized",
        updatedAt: "2024-07-13",
      },
      {
        label: "Pricing update",
        url: "https://quickai.dev/pricing/tempo-lite",
        updatedAt: "2024-07-01",
      },
    ],
    history30d: [
      {
        date: "2024-06-23",
        total: 71,
        subscores: { reasoning: 65, coding: 63, math: 62, multimodal: 48, safety: 78 },
      },
      {
        date: "2024-07-19",
        total: 74,
        subscores: { reasoning: 68, coding: 66, math: 64, multimodal: 50, safety: 80 },
      },
    ],
    updatedAt: "2024-07-19",
  },
  {
    id: "lumen-video",
    name: "Lumen Video",
    vendor: { id: "cinematic", name: "Cinematic AI" },
    modality: ["video", "multimodal"],
    total: 77,
    subscores: {
      reasoning: 72,
      coding: 60,
      math: 66,
      multimodal: 83,
      safety: 78,
    },
    evidence: [
      {
        label: "Video QA leaderboard",
        url: "https://cinematic.ai/benchmarks/video-qa-lumen",
        score: 81.6,
        updatedAt: "2024-07-09",
      },
      {
        label: "Streaming v1.4 release notes",
        url: "https://cinematic.ai/releases/lumen-video-1-4",
        note: "Lower bitrate mode",
        updatedAt: "2024-07-02",
      },
    ],
    history30d: [
      {
        date: "2024-06-21",
        total: 73,
        subscores: { reasoning: 69, coding: 58, math: 62, multimodal: 80, safety: 76 },
      },
      {
        date: "2024-07-17",
        total: 77,
        subscores: { reasoning: 72, coding: 60, math: 66, multimodal: 83, safety: 78 },
      },
    ],
    updatedAt: "2024-07-17",
  },
];
