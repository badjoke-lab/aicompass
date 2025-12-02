import { safeJSON, withError } from "@/lib/dev/v4/http";
import { buildSnapshot } from "@/lib/dev/v4/snapshot";
import { toLeaderboardModel } from "@/lib/dev/v4/transform";
import type { LeaderboardResponse } from "@/lib/dev/v4/types";

export const revalidate = 0;

export async function GET(): Promise<Response> {
  return withError(() => {
    const snapshot = buildSnapshot();
    const models = snapshot.models.map(toLeaderboardModel);

    return safeJSON<LeaderboardResponse>({
      status: "ok",
      updated: snapshot.updated,
      models,
    });
  });
}
