import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/metadata";
import { SCORE_WEIGHTS } from "@/lib/v3/snapshot";

export const metadata: Metadata = buildPageMetadata({
  title: "Methodology",
  description: "Understand how AIMS v3 normalizes Hugging Face signals and combines them into transparent composite scores.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">Methodology</h1>
      <p className="text-sm text-slate-400">
        aims-v3 stays simple: pull live signals from Hugging Face, normalize them across all tracked models, then
        apply deterministic weights. No local fixtures, no manual overrides.
      </p>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">Data flow</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>Fetch Hugging Face metadata (downloads, likes, lastModified) for a curated list of foundation models.</li>
          <li>Normalize each metric using min–max scaling so models are comparable on every refresh.</li>
          <li>Combine the three scaled scores with fixed weights to produce the composite leaderboard total.</li>
          <li>Cache snapshots for a few minutes and retry failed calls to avoid spiky 500s.</li>
        </ul>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">Scoring knobs</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>
            Adoption weight: <strong>{(SCORE_WEIGHTS.adoption * 100).toFixed(0)}%</strong> (downloads)
          </li>
          <li>
            Ecosystem weight: <strong>{(SCORE_WEIGHTS.ecosystem * 100).toFixed(0)}%</strong> (likes)
          </li>
          <li>
            Velocity weight: <strong>{(SCORE_WEIGHTS.velocity * 100).toFixed(0)}%</strong> (recency)
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          Scores always recompute from the latest public metadata; no manual curation or private signals are used.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">Transparency requirements</h2>
        <p className="text-sm text-slate-400">
          All values visible on the site come directly from external APIs. If a fetch fails the row stays visible with an error
          flag so visitors can track health without losing context.
        </p>
      </div>
    </div>
  );
}
