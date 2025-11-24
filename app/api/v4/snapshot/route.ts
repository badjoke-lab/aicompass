import { createJsonResponse } from "../utils";
import { getSnapshot } from "@/lib/v4/snapshot";

export const revalidate = 0;

export async function GET() {
  const snapshot = await getSnapshot();
  return createJsonResponse(snapshot);
}
