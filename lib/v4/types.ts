export type V4StatusOk = "ok";
export type V4StatusError = "error";

export interface V4ErrorResponse {
  status: V4StatusError;
  message: string;
}

export interface V4SnapshotModel {
  id: string;
  provider?: string;
  name?: string;
  updated?: string | null;
  scores?: unknown[];
}

export interface V4SnapshotResponse {
  status: V4StatusOk;
  updated: string | null;
  models: V4SnapshotModel[];
}

export interface V4ModelSummary {
  id: string;
  name: string;
  provider: string;
  updated?: string | null;
}

export interface V4ModelProvider {
  id: string;
  name: string;
  models: V4ModelSummary[];
}

export interface V4ModelsResponse {
  status: V4StatusOk;
  providers: V4ModelProvider[];
  total: number;
}
