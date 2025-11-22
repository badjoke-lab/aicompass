const HUGGING_FACE_ROOT = "https://huggingface.co";
const HUGGING_FACE_API = `${HUGGING_FACE_ROOT}/api/models`;
const CACHE_TTL_MS = 5 * 60 * 1000;
const SCORE_PRECISION = 1;

export interface ModelSource {
  id: string;
  displayName: string;
  provider: string;
  focus?: string;
}

export interface RawModelResponse {
  modelId: string;
  author?: string;
  downloads?: number;
  likes?: number;
  private?: boolean;
  gated?: string | boolean;
  tags?: string[];
  pipeline_tag?: string;
  lastModified?: string;
}

export interface NormalizedModel {
  id: string;
  slug: string;
  name: string;
  provider: string;
  focus?: string;
  metrics: {
    downloads: number;
    likes: number;
    lastModified: string | null;
    recencyDays: number | null;
  };
  status: "ready" | "error";
  source: string;
  error?: string;
}

export interface ScoreWeights {
  adoption: number;
  ecosystem: number;
  velocity: number;
}

export interface SnapshotModel extends NormalizedModel {
  scores: {
    adoption: number;
    ecosystem: number;
    velocity: number;
    total: number;
  };
}

export interface Snapshot {
  updatedAt: string;
  models: SnapshotModel[];
  metrics: {
    downloadRange: Range;
    likeRange: Range;
    recencyRange: Range;
    sourceCount: number;
    readyCount: number;
  };
  scores: {
    weights: ScoreWeights;
  };
}

interface Range {
  min: number;
  max: number;
}

const MODEL_SOURCES: ModelSource[] = [
  { id: "meta-llama/Meta-Llama-3-8B", displayName: "Llama 3 8B", provider: "Meta", focus: "General" },
  { id: "mistralai/Mistral-7B-Instruct-v0.2", displayName: "Mistral 7B Instruct", provider: "Mistral", focus: "Instruction" },
  { id: "Qwen/Qwen2.5-7B-Instruct", displayName: "Qwen2.5 7B", provider: "Alibaba Qwen", focus: "Multilingual" },
  { id: "google/gemma-2-9b-it", displayName: "Gemma 2 9B IT", provider: "Google", focus: "Instruction" },
  { id: "microsoft/Phi-3-mini-4k-instruct", displayName: "Phi-3 Mini", provider: "Microsoft", focus: "Lightweight" }
];

const SCORE_WEIGHTS: ScoreWeights = {
  adoption: 0.45,
  ecosystem: 0.35,
  velocity: 0.2
};

let cachedSnapshot: Snapshot | null = null;
let cachedAt = 0;

export async function getSnapshot(): Promise<Snapshot> {
  const now = Date.now();
  if (cachedSnapshot && now - cachedAt < CACHE_TTL_MS) {
    return cachedSnapshot;
  }

  const normalized = await Promise.all(MODEL_SOURCES.map((source) => fetchModel(source)));
  const readyModels = normalized.filter((model) => model.status === "ready");

  const downloadRange = getRange(readyModels.map((model) => model.metrics.downloads));
  const likeRange = getRange(readyModels.map((model) => model.metrics.likes));
  const recencyRange = getRange(
    readyModels
      .map((model) => model.metrics.recencyDays)
      .filter((days): days is number => days != null)
  );

  const scoredModels = normalized
    .map((model) => scoreModel(model, { downloadRange, likeRange, recencyRange }))
    .sort((a, b) => b.scores.total - a.scores.total);

  const snapshot: Snapshot = {
    updatedAt: new Date().toISOString(),
    models: scoredModels,
    metrics: {
      downloadRange,
      likeRange,
      recencyRange,
      sourceCount: MODEL_SOURCES.length,
      readyCount: readyModels.length
    },
    scores: {
      weights: SCORE_WEIGHTS
    }
  };

  cachedSnapshot = snapshot;
  cachedAt = now;
  return snapshot;
}

async function fetchModel(source: ModelSource): Promise<NormalizedModel> {
  const url = `${HUGGING_FACE_API}/${source.id}`;
  try {
    const response = await fetchWithRetry(url, { headers: { Accept: "application/json" } });
    const payload = (await response.json()) as RawModelResponse;
    return normalizeModel(payload, source);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      id: source.id,
      slug: toSlug(source.displayName),
      name: source.displayName,
      provider: source.provider,
      focus: source.focus,
      metrics: {
        downloads: 0,
        likes: 0,
        lastModified: null,
        recencyDays: null
      },
      status: "error",
      source: HUGGING_FACE_ROOT,
      error: message
    };
  }
}

async function fetchWithRetry(url: string, init?: RequestInit, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        next: { revalidate: CACHE_TTL_MS / 1000 }
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      await delay(200 * Math.pow(2, attempt));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Failed to fetch source");
}

function normalizeModel(payload: RawModelResponse, source: ModelSource): NormalizedModel {
  const downloads = Number.isFinite(payload.downloads) ? Number(payload.downloads) : 0;
  const likes = Number.isFinite(payload.likes) ? Number(payload.likes) : 0;
  const lastModified = payload.lastModified ?? null;
  const recencyDays = getRecencyDays(lastModified);

  return {
    id: source.id,
    slug: toSlug(source.displayName),
    name: source.displayName,
    provider: source.provider,
    focus: source.focus,
    metrics: {
      downloads,
      likes,
      lastModified,
      recencyDays
    },
    status: "ready",
    source: `${HUGGING_FACE_ROOT}/${source.id}`
  };
}

function scoreModel(
  model: NormalizedModel,
  ranges: { downloadRange: Range; likeRange: Range; recencyRange: Range }
): SnapshotModel {
  if (model.status === "error") {
    return {
      ...model,
      scores: {
        adoption: 0,
        ecosystem: 0,
        velocity: 0,
        total: 0
      }
    };
  }

  const adoptionScore = scale(model.metrics.downloads, ranges.downloadRange) * 100;
  const ecosystemScore = scale(model.metrics.likes, ranges.likeRange) * 100;
  const velocityScore = invertScale(model.metrics.recencyDays, ranges.recencyRange) * 100;

  const total =
    adoptionScore * SCORE_WEIGHTS.adoption +
    ecosystemScore * SCORE_WEIGHTS.ecosystem +
    velocityScore * SCORE_WEIGHTS.velocity;

  return {
    ...model,
    scores: {
      adoption: round(adoptionScore),
      ecosystem: round(ecosystemScore),
      velocity: round(velocityScore),
      total: round(total)
    }
  };
}

function getRecencyDays(lastModified: string | null): number | null {
  if (!lastModified) return null;
  const modifiedTime = new Date(lastModified).getTime();
  if (Number.isNaN(modifiedTime)) return null;
  const deltaMs = Date.now() - modifiedTime;
  return Math.max(0, Math.round(deltaMs / (1000 * 60 * 60 * 24)));
}

function getRange(values: number[]): Range {
  const filtered = values.filter((value) => Number.isFinite(value));
  if (filtered.length === 0) {
    return { min: 0, max: 1 };
  }
  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  if (min === max) {
    return { min: min === 0 ? 0 : min - 1, max: max + 1 };
  }
  return { min, max };
}

function scale(value: number, range: Range): number {
  if (!Number.isFinite(value)) return 0.5;
  if (range.max === range.min) return 0.5;
  const clamped = Math.min(Math.max(value, range.min), range.max);
  return (clamped - range.min) / (range.max - range.min);
}

function invertScale(value: number | null, range: Range): number {
  if (value == null) return 0.5;
  return 1 - scale(value, range);
}

function toSlug(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function round(value: number): number {
  return Number(value.toFixed(SCORE_PRECISION));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { MODEL_SOURCES, SCORE_WEIGHTS };
