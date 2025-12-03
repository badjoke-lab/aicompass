import { NextResponse } from "next/server";

import sampleData from "@/lib/data/sample.json";
import type { V4SnapshotResponse } from "@/types/v4";

export const revalidate = 0;

export async function GET() {
  const payload: V4SnapshotResponse = {
    status: "ok",
    models: sampleData.models,
  };

  return NextResponse.json(payload, { headers: { "X-Robots-Tag": "noindex, nofollow" } });
}
