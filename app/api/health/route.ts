import { NextResponse } from "next/server";

import sampleData from "@/lib/data/sample.json";

export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    status: "ok",
    snapshot: {
      updated: sampleData.updated,
      source: "v4-sample",
    },
  });
}
