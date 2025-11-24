import { refreshSnapshot } from "@/lib/v3/snapshot";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  try {
    const snapshot = await refreshSnapshot();
    return NextResponse.json(snapshot, {
      status: 200,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Snapshot refresh error", error);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: { "X-Robots-Tag": "noindex, nofollow" } }
    );
  }
}
