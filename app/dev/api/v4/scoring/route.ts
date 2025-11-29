import { devV4Models } from "@/data/dev/v4/models";
import { createJsonResponse } from "../utils";
import { runScoringPipeline } from "@/lib/dev/v4/scoring";
import type { ScoringResponse } from "@/lib/dev/v4/types";

export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const computed = runScoringPipeline(devV4Models);
  const models = id
    ? computed.filter((model) => model.id === id || model.slug === id)
    : computed;

  return createJsonResponse<ScoringResponse>({
    status: "ok",
    models,
  });
}
