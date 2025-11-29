import { createJsonResponse } from "../utils";
import { runScoringPipeline } from "@/lib/dev/v4/scoring";

export const revalidate = 0;

export async function GET() {
  const scores = runScoringPipeline();
  return createJsonResponse({
    version: "v4-scoring",
    items: scores,
  });
}
