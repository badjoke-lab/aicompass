import { NextResponse } from "next/server";

import sampleData from "@/lib/data/sample.json";
import { normalizeModelScores } from "@/lib/normalizers";
import type { V4LeaderboardResponse } from "@/types/v4";

export const revalidate = 0;

export async function GET() {
  const leaderboard = sampleData.models
    .map(normalizeModelScores)
    .sort((a, b) => b.total - a.total);

  const payload: V4LeaderboardResponse = {
    status: "ok",
    leaderboard,
  };

  return NextResponse.json(payload, { headers: { "X-Robots-Tag": "noindex, nofollow" } });
}
