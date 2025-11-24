import { safeJSON } from "@/lib/v4/http";

// Shared helper to wrap JSON responses for the v4 API namespace. The payload is
// returned with a standard "noindex" directive to keep experimental routes out
// of search indexes while the foundation stabilizes.
export function createJsonResponse<T>(payload: T, status = 200) {
  return safeJSON(payload, status);
}

export { noindexHeaders, safeJSON } from "@/lib/v4/http";
