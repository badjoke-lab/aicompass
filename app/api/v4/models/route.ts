import { safeJSON } from "@/lib/v4/http";
import { V4ModelsResponse } from "@/lib/v4/types";

export const revalidate = 0;

export async function GET() {
  const payload: V4ModelsResponse = {
    status: "ok",
    providers: [],
    total: 0,
  };

  return safeJSON(payload);
}
