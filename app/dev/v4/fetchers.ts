import type { SnapshotResponse } from "@/lib/v4/types";

const SNAPSHOT_ENDPOINT = "/dev/api/v4/snapshot";

export async function getV4Snapshot(): Promise<SnapshotResponse> {
  const response = await fetch(SNAPSHOT_ENDPOINT, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Snapshot request failed with status ${response.status}`);
  }

  const data: SnapshotResponse = await response.json();

  if (data.status !== "ok" || !Array.isArray(data.models)) {
    throw new Error("Invalid snapshot payload");
  }

  return data;
}
