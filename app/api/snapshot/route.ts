import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/v3/snapshot";

export const revalidate = 0;

export async function GET() {
  try {
    const snapshot = await getSnapshot();
    return NextResponse.json(snapshot, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
