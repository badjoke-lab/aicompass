export type V4Status = "ok" | "error";

export interface V4ErrorResponse {
  status: "error";
  message: string;
}

export interface SnapshotModelScore {
  metric: string;
  score: number;
  details?: Record<string, unknown>;
}

export interface SnapshotModelMetadata {
  provider: string;
  focus?: string;
  source?: string;
}

export interface SnapshotModelMetrics {
  downloads?: number;
  likes?: number;
  lastModified?: string | null;
  recencyDays?: number | null;
}

export interface SnapshotModel {
  id: string;
  slug: string;
  name: string;
  metadata: SnapshotModelMetadata;
  metrics?: SnapshotModelMetrics;
  scores?: SnapshotModelScore[];
  status?: "ready" | "error";
  error?: string | null;
}

export interface SnapshotResponse {
  status: "ok";
  updated: string | null;
  models: SnapshotModel[];
}

export interface ModelProviderSummary {
  id: string;
  name: string;
  modelCount?: number;
  focusAreas?: string[];
}

export interface ModelListResponse {
  status: "ok";
  providers: ModelProviderSummary[];
  total: number;
}

export type V4Response = SnapshotResponse | ModelListResponse | V4ErrorResponse;
