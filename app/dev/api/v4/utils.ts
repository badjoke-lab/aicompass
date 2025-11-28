import { NextResponse } from "next/server";

// Shared helper to wrap JSON responses for the v4 API namespace. The payload is
// returned with a standard "noindex" directive to keep experimental routes out
// of search indexes while the foundation stabilizes.
export function createJsonResponse<T>(payload: T, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
