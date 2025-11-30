import { devV4Models } from "@/data/dev/v4/models";
import { safeJSON, withError } from "@/lib/dev/v4/http";
import { runScoringPipeline } from "@/lib/dev/v4/scoring";
import type { ScoringResponse, V4ErrorResponse } from "@/lib/dev/v4/types";

export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  return withError(() => {
    const models = runScoringPipeline(devV4Models);
    const match = models.find((entry) => entry.id === params.id || entry.slug === params.id);

    if (!match) {
      const payload: V4ErrorResponse = {
        status: "error",
        message: "Model not found",
      };

      return safeJSON(payload, { status: 404 });
    }

    return safeJSON<ScoringResponse>({
      status: "ok",
      models: [match],
    });
  });
}
