import { NextResponse } from "next/server";

import type { V4ErrorResponse } from "./types";

export const noindexHeaders = {
  "X-Robots-Tag": "noindex, nofollow",
};

export function safeJSON<T>(payload: T, init: ResponseInit = {}): NextResponse {
  const headers = new Headers(init.headers ?? {});
  headers.set("X-Robots-Tag", noindexHeaders["X-Robots-Tag"]);

  return NextResponse.json(payload, { ...init, headers });
}

export async function withError(handler: () => Promise<Response> | Response): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const payload: V4ErrorResponse = { status: "error", message };
    return safeJSON(payload, { status: 500 });
  }
}
