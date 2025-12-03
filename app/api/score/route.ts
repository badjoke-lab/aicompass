import { NextRequest, NextResponse } from "next/server";

import sampleData from "@/lib/data/sample.json";
import type { V4Model } from "@/types/v4";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? request.nextUrl.searchParams.get("id");
  const model = slug ? sampleData.models.find((entry) => entry.slug === slug || entry.id === slug) : undefined;

  const payload: { status: "ok"; score: V4Model | null } = {
    status: "ok",
    score: model ?? null,
  };

  const status = model ? 200 : 404;

  return NextResponse.json(payload, {
    status,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
