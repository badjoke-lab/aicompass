import { safeJSON } from "@/lib/v4/http";
import { V4SnapshotResponse } from "@/lib/v4/types";

export const revalidate = 0;

export async function GET() {
  const payload: V4SnapshotResponse = {
    status: "ok",
    updated: new Date().toISOString(),
    models: [],
  };

  return safeJSON(payload);
}
