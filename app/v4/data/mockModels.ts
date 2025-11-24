import { Model } from '../lib/types';
import { computeTotal } from '../lib/utils';

const models: Model[] = [
  {
    id: 'orion-2x',
    name: 'Orion 2X',
    vendor: 'Nebula Labs',
    modality: 'text',
    subscores: {
      reasoning: 24,
      coding: 22,
      safety: 20,
      speed: 18,
      cost: 16,
    },
    totalScore: 24 + 22 + 20 + 18 + 16,
    evidence: [
      {
        label: 'Benchmark: Massive Multitask Language Understanding',
        url: 'https://benchmarks.nebulalabs.ai/mmlu/orion-2x',
        sourceType: 'benchmark',
        date: '2024-07-10',
      },
      {
        label: 'Engineering blog on function calling improvements',
        url: 'https://blog.nebulalabs.ai/orion-2x-function-calling',
        sourceType: 'blog',
        date: '2024-06-15',
      },
    ],
    history: [
      {
        date: '2024-05-20',
        subscores: { reasoning: 20, coding: 19, safety: 18, speed: 16, cost: 15 },
        totalScore: 88,
      },
      {
        date: '2024-06-20',
        subscores: { reasoning: 22, coding: 20, safety: 19, speed: 17, cost: 15 },
        totalScore: 93,
      },
      {
        date: '2024-07-20',
        subscores: { reasoning: 24, coding: 22, safety: 20, speed: 18, cost: 16 },
        totalScore: 100,
      },
    ],
  },
  {
    id: 'hikari-vision',
    name: 'Hikari Vision',
    vendor: 'Sakura AI',
    modality: 'image',
    subscores: {
      reasoning: 16,
      coding: 10,
      safety: 19,
      speed: 21,
      cost: 15,
    },
    totalScore: 81,
    evidence: [
      {
        label: 'ImageNet v3 results',
        url: 'https://sakura.ai/research/imagenet-v3-hikari',
        sourceType: 'benchmark',
        date: '2024-06-02',
      },
      {
        label: 'Customer story: Retail visual QA',
        url: 'https://sakura.ai/customers/retail-visual-qa',
        sourceType: 'case-study',
        date: '2024-07-01',
      },
    ],
    history: [
      {
        date: '2024-05-10',
        subscores: { reasoning: 12, coding: 8, safety: 17, speed: 18, cost: 14 },
        totalScore: 69,
      },
      {
        date: '2024-06-12',
        subscores: { reasoning: 14, coding: 9, safety: 18, speed: 20, cost: 15 },
        totalScore: 76,
      },
      {
        date: '2024-07-18',
        subscores: { reasoning: 16, coding: 10, safety: 19, speed: 21, cost: 15 },
        totalScore: 81,
      },
    ],
  },
  {
    id: 'aurora-voice',
    name: 'Aurora Voice',
    vendor: 'Northwind',
    modality: 'audio',
    subscores: {
      reasoning: 14,
      coding: 8,
      safety: 18,
      speed: 19,
      cost: 17,
    },
    totalScore: 76,
    evidence: [
      {
        label: 'Podcast summarization study',
        url: 'https://northwind.ai/research/podcast-summarization',
        sourceType: 'paper',
        date: '2024-07-05',
      },
      {
        label: 'Latency measurements for streaming ASR',
        url: 'https://status.northwind.ai/aurora-voice-latency',
        sourceType: 'status',
        date: '2024-06-22',
      },
    ],
    history: [
      {
        date: '2024-05-15',
        subscores: { reasoning: 10, coding: 6, safety: 16, speed: 17, cost: 16 },
        totalScore: 65,
      },
      {
        date: '2024-06-17',
        subscores: { reasoning: 12, coding: 7, safety: 17, speed: 18, cost: 16 },
        totalScore: 70,
      },
      {
        date: '2024-07-22',
        subscores: { reasoning: 14, coding: 8, safety: 18, speed: 19, cost: 17 },
        totalScore: 76,
      },
    ],
  },
  {
    id: 'polyglot-mm',
    name: 'Polyglot MM',
    vendor: 'OpenCanvas',
    modality: 'multimodal',
    subscores: {
      reasoning: 23,
      coding: 21,
      safety: 19,
      speed: 17,
      cost: 14,
    },
    totalScore: 94,
    evidence: [
      {
        label: 'Multimodal tasks leaderboard',
        url: 'https://opencanvas.ai/leaderboards/multimodal-mm',
        sourceType: 'benchmark',
        date: '2024-07-16',
      },
      {
        label: 'Conference talk on unified embeddings',
        url: 'https://opencanvas.ai/events/unified-embeddings',
        sourceType: 'talk',
        date: '2024-06-10',
      },
    ],
    history: [
      {
        date: '2024-05-18',
        subscores: { reasoning: 18, coding: 17, safety: 17, speed: 15, cost: 13 },
        totalScore: 80,
      },
      {
        date: '2024-06-19',
        subscores: { reasoning: 21, coding: 19, safety: 18, speed: 16, cost: 13 },
        totalScore: 87,
      },
      {
        date: '2024-07-21',
        subscores: { reasoning: 23, coding: 21, safety: 19, speed: 17, cost: 14 },
        totalScore: 94,
      },
    ],
  },
  {
    id: 'tempo-lite',
    name: 'Tempo Lite',
    vendor: 'QuickAI',
    modality: 'text',
    subscores: {
      reasoning: 15,
      coding: 14,
      safety: 17,
      speed: 23,
      cost: 21,
    },
    totalScore: 90,
    evidence: [
      {
        label: 'Latency showcase with edge deployments',
        url: 'https://quickai.dev/blog/tempo-lite-edge',
        sourceType: 'blog',
        date: '2024-07-12',
      },
      {
        label: 'Pricing announcement',
        url: 'https://quickai.dev/pricing/tempo-lite',
        sourceType: 'docs',
        date: '2024-06-08',
      },
    ],
    history: [
      {
        date: '2024-05-12',
        subscores: { reasoning: 12, coding: 12, safety: 15, speed: 20, cost: 19 },
        totalScore: 78,
      },
      {
        date: '2024-06-14',
        subscores: { reasoning: 14, coding: 13, safety: 16, speed: 22, cost: 20 },
        totalScore: 85,
      },
      {
        date: '2024-07-19',
        subscores: { reasoning: 15, coding: 14, safety: 17, speed: 23, cost: 21 },
        totalScore: 90,
      },
    ],
  },
  {
    id: 'lumen-video',
    name: 'Lumen Video',
    vendor: 'Cinematic AI',
    modality: 'video',
    subscores: {
      reasoning: 17,
      coding: 12,
      safety: 18,
      speed: 16,
      cost: 13,
    },
    totalScore: 76,
    evidence: [
      {
        label: 'Video QA leaderboard entry',
        url: 'https://cinematic.ai/benchmarks/video-qa-lumen',
        sourceType: 'benchmark',
        date: '2024-07-09',
      },
      {
        label: 'Release notes: v1.4 streaming',
        url: 'https://cinematic.ai/releases/lumen-video-1-4',
        sourceType: 'release-notes',
        date: '2024-06-05',
      },
    ],
    history: [
      {
        date: '2024-05-08',
        subscores: { reasoning: 13, coding: 9, safety: 16, speed: 14, cost: 12 },
        totalScore: 64,
      },
      {
        date: '2024-06-09',
        subscores: { reasoning: 15, coding: 11, safety: 17, speed: 15, cost: 12 },
        totalScore: 70,
      },
      {
        date: '2024-07-17',
        subscores: { reasoning: 17, coding: 12, safety: 18, speed: 16, cost: 13 },
        totalScore: 76,
      },
    ],
  },
];

export function getMockModels(): Model[] {
  return models.map((model) => ({
    ...model,
    totalScore: computeTotal(model),
  }));
}

export function getModelById(id: string): Model | undefined {
  return getMockModels().find((model) => model.id === id);
}

export default models;
