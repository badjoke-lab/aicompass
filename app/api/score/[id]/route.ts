import { NextResponse } from "next/server";

import sampleData from "@/lib/data/sample.json";
import { normalizeModelScores } from "@/lib/normalizers";
import type { V4Model } from "@/types/v4";

export const revalidate = 0;

export async function GET(_: Request, context: { params?: { id?: string } }) {
  const id = context.params?.id;
  const model = id ? sampleData.models.find((entry) => entry.slug === id || entry.id === id) : undefined;
  const normalizedModel = model ? normalizeModelScores(model) : null;

  const payload: { status: "ok"; score: V4Model | null } = {
    status: "ok",
    score: normalizedModel,
  };

  const status = normalizedModel ? 200 : 404;

  return NextResponse.json(payload, {
    status,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
