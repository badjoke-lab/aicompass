import { safeJSON, withError } from "@/lib/dev/v4/http";
import type { SnapshotResponse } from "@/lib/dev/v4/types";

export const revalidate = 0;

export async function GET(): Promise<Response> {
  return withError(() =>
    safeJSON<SnapshotResponse>({
      status: "ok",
      updated: null,
      models: [],
    })
  );
}
