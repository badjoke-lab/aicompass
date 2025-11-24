import { createJsonResponse } from "../../utils";
import { refreshSnapshot } from "@/lib/v4/snapshot";

export const revalidate = 0;

export async function GET() {
  const snapshot = await refreshSnapshot();
  return createJsonResponse(snapshot);
}
