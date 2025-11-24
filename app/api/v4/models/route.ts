import { safeJSON, withError } from "@/lib/v4/http";
import type { ModelListResponse } from "@/lib/v4/types";

export const revalidate = 0;

export async function GET(): Promise<Response> {
  return withError(() =>
    safeJSON<ModelListResponse>({
      status: "ok",
      providers: [],
      total: 0,
    })
  );
}
