import { NextResponse } from "next/server";

import { getV4Snapshot } from "@/app/dev/v4/fetchers";

export const revalidate = 0;

export async function GET(): Promise<Response> {
  try {
    const snapshot = await getV4Snapshot();
    return NextResponse.json(snapshot, { headers: { "X-Robots-Tag": "noindex, nofollow" } });
  } catch (error) {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
