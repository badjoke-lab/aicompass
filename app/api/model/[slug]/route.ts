import { NextResponse } from "next/server";

import sampleData from "@/lib/data/sample.json";
import { normalizeModelScores } from "@/lib/normalizers";
import type { V4ModelResponse } from "@/types/v4";

export const revalidate = 0;

export async function GET(_: Request, context: { params?: { slug?: string } }) {
  const slug = context.params?.slug;
  const model = slug
    ? sampleData.models.find((entry) => entry.slug === slug || entry.id === slug)
    : undefined;
  const normalizedModel = model ? normalizeModelScores(model) : null;

  const payload: V4ModelResponse = {
    status: "ok",
    model: normalizedModel,
  };

  const status = normalizedModel ? 200 : 404;

  return NextResponse.json(payload, {
    status,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
