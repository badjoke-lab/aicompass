export type Modality = "text" | "image" | "audio" | "video" | "multimodal";

export type Evidence = {
  label: string; // e.g. "MMLU", "HumanEval"
  url: string; // source link
  score?: number; // optional raw score
  note?: string;
  updatedAt: string; // ISO
};

export type Subscores = {
  reasoning: number; // 0-100
  coding: number;
  math: number;
  multimodal: number;
  safety: number;
};

export type HistoryPoint = {
  date: string; // ISO day
  total: number;
  subscores: Subscores;
};

export type Vendor = {
  id: string; // "openai" etc
  name: string; // display
};

export type ModelV4 = {
  id: string; // "gpt-5"
  name: string; // "GPT-5"
  vendor: Vendor;
  modality: Modality[];
  total: number; // 0-100
  subscores: Subscores; // 0-100 each
  evidence: Evidence[];
  history?: HistoryPoint[]; // history points (can be sparse)
  updatedAt: string;
  tags?: string[];
};
