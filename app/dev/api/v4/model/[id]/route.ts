import { safeJSON, withError } from "@/lib/dev/v4/http";
import { buildSnapshot } from "@/lib/dev/v4/snapshot";
import { toLeaderboardModel } from "@/lib/dev/v4/transform";
import type { ScoringResponse, V4ErrorResponse } from "@/lib/dev/v4/types";

export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  return withError(() => {
    const snapshot = buildSnapshot();
    const match = snapshot.models.find((entry) => entry.id === params.id || entry.slug === params.id);

    if (!match) {
      const payload: V4ErrorResponse = {
        status: "error",
        message: "Model not found",
      };

      return safeJSON(payload, { status: 404 });
    }

    return safeJSON<ScoringResponse>({
      status: "ok",
      models: [toLeaderboardModel(match)],
    });
  });
}
