import { safeJSON } from "@/lib/v4/http";

// Base handler for the v4 API namespace. All v4 endpoints should share the
// same response metadata to prevent indexing while the surface is in flux.
export const revalidate = 0;

export async function GET() {
  return safeJSON({
    version: "v4",
    status: "ok",
    message: "AI Model Scoreboard v4 foundation is active",
  });
}
