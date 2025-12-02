import { safeJSON, withError } from "@/lib/dev/v4/http";
import { buildSnapshot } from "@/lib/dev/v4/snapshot";
import type { SnapshotResponse } from "@/lib/dev/v4/types";

export const revalidate = 0;

export async function GET(): Promise<Response> {
  return withError(() => {
    return safeJSON<SnapshotResponse>(buildSnapshot());
  });
}
