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
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">About</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">About AI Model Scoreboard</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
          AI Model Scoreboard is a community-run initiative to benchmark foundation models with an emphasis on evidence,
          reproducibility, and accessible storytelling. We are not affiliated with any of the vendors we track.
        </p>
      </header>

      <div className="space-y-3 text-sm leading-relaxed text-slate-400">
        <p>
          Every score and spike that appears on the board must be backed by a public artifact—eval reports, deployment notes,
          pricing updates, or policy statements. If evidence is missing, the model stays in a provisional “waiting” state until
          we can verify the claim.
        </p>
        <p>
          The project is intentionally minimal: one table, clear deltas, and a cadence that mirrors how operators make roadmap
          decisions. Transparency is the product.
        </p>
      </div>
    </div>
  );
}
