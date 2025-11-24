import { NextResponse } from "next/server";

import { V4ErrorResponse } from "./types";

type ResponseOptions = number | ResponseInit;

export const noindexHeaders = { "X-Robots-Tag": "noindex, nofollow" } as const;

export function safeJSON<T>(payload: T, init: ResponseOptions = 200) {
  const responseInit: ResponseInit = typeof init === "number" ? { status: init } : init;

  return NextResponse.json(payload, {
    ...responseInit,
    headers: {
      ...noindexHeaders,
      ...(responseInit.headers ?? {}),
    },
  });
}

export function withError(message: string, status = 500) {
  const payload: V4ErrorResponse = { status: "error", message };
  return safeJSON(payload, status);
}
