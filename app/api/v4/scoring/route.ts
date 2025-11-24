import { safeJSON } from "@/lib/v4/http";
import { runScoringPipeline } from "@/lib/v4/scoring";

export const revalidate = 0;

export async function GET() {
  const scores = runScoringPipeline();
  return safeJSON({
    version: "v4-scoring",
    items: scores,
  });
}
