import { NextRequest, NextResponse } from "next/server";

import sampleData from "@/lib/data/sample.json";
import type { V4Model } from "@/types/v4";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const model = id ? sampleData.models.find((entry) => entry.id === id || entry.slug === id) : undefined;

  const payload: { status: "ok"; score: V4Model | null } = {
    status: "ok",
    score: model ?? null,
  };

  return NextResponse.json(payload, { headers: { "X-Robots-Tag": "noindex, nofollow" } });
}
