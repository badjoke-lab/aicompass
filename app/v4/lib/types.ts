export type Modality = 'text' | 'image' | 'audio' | 'video' | 'multimodal';

export type Subscores = Record<string, number>;

export interface EvidenceItem {
  label: string;
  url: string;
  sourceType: string;
  date: string; // ISO string
}

export interface HistoryEntry {
  date: string; // ISO string
  totalScore: number;
  subscores: Subscores;
}

export interface Model {
  id: string;
  name: string;
  vendor: string;
  modality: Modality;
  subscores: Subscores;
  totalScore: number;
  evidence: EvidenceItem[];
  history: HistoryEntry[];
}

export type SortDirection = 'asc' | 'desc';
