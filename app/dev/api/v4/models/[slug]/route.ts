import { safeJSON, withError } from "@/lib/dev/v4/http";
import { buildSnapshot } from "@/lib/dev/v4/snapshot";
import { toLeaderboardModel } from "@/lib/dev/v4/transform";
import type { LeaderboardModel, V4ErrorResponse } from "@/lib/dev/v4/types";

export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
): Promise<Response> {
  return withError(() => {
    const snapshot = buildSnapshot();
    const model = snapshot.models.find((entry) => entry.slug === params.slug || entry.id === params.slug);

    if (!model) {
      const payload: V4ErrorResponse = { status: "error", message: "Model not found" };
      return safeJSON(payload, { status: 404 });
    }

    const leaderboardModel: LeaderboardModel = toLeaderboardModel(model);

    return safeJSON({
      status: "ok",
      models: [leaderboardModel],
    });
  });
}
