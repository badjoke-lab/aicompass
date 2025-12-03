import { NextResponse } from "next/server";

import sampleData from "@/lib/data/sample.json";
import { normalizeModelScores } from "@/lib/normalizers";
import type { V4SnapshotResponse } from "@/types/v4";

export const revalidate = 0;

export async function GET() {
  const models = sampleData.models.map(normalizeModelScores);

  const payload: V4SnapshotResponse = {
    status: "ok",
    models,
  };

  return NextResponse.json(payload, { headers: { "X-Robots-Tag": "noindex, nofollow" } });
}
