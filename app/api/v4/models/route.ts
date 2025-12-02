import { safeJSON, withError } from "@/lib/v4/http";

interface ModelListResponse {
  status: "ok";
  providers: { id: string; name: string; modelCount?: number; focusAreas?: string[] }[];
  total: number;
}

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
