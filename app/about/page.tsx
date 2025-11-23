import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn how AI Model Scoreboard benchmarks models with transparent signals, reproducible methods, and public evidence.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">About AI Model Scoreboard</h1>
      <p className="text-sm text-slate-400">
        AI Model Scoreboard is a community-run initiative to benchmark foundation models with an emphasis on evidence,
        reproducibility, and accessible storytelling. We are not affiliated with any of the vendors we track.
      </p>
      <p className="text-sm text-slate-400">
        Every score and spike that appears on the board must be backed by a public artifact—eval reports, deployment notes,
        pricing updates, or policy statements. If evidence is missing, the model stays in a provisional “waiting” state until
        we can verify the claim.
      </p>
      <p className="text-sm text-slate-400">
        The project is intentionally minimal: one table, clear deltas, and a cadence that mirrors how operators make roadmap
        decisions. Transparency is the product.
      </p>
    </div>
  );
}
