import { getHealth, getSnapshot } from "@/lib/v3/snapshot";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  try {
    await getSnapshot();
  } catch (error) {
    console.error("Health check snapshot error", error);
  }

  return NextResponse.json(getHealth());
}
