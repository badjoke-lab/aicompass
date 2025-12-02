import { NextResponse } from "next/server";

import { buildLeaderboardPayload } from "../data";

export const revalidate = 0;

export async function GET(_request: Request): Promise<Response> {
  const payload = buildLeaderboardPayload();

  return NextResponse.json(payload, {
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
