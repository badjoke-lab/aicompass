import { NextResponse } from "next/server";

import { buildScoringPayload } from "../../data";

export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
): Promise<Response> {
  const payload = buildScoringPayload(params.slug);

  return NextResponse.json(payload, {
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
