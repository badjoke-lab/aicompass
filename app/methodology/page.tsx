import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/metadata";

const SCORE_WEIGHTS = {
  reasoning: 0.3,
  coding: 0.25,
  chat: 0.25,
  safety: 0.2,
};

export const metadata: Metadata = buildPageMetadata({
  title: "Methodology",
  description: "Understand how AIMS v4 blends reasoning, coding, chat, and safety signals into composite scores.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v4</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">Methodology</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
          The v4 stack simplifies the surface by using a single snapshot format. Each score blends structured subscores and
          traces back to evidence so the leaderboard reflects the exact signals behind every change.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-slate-100">Data flow</h2>
          <p className="text-xs uppercase tracking-wide text-slate-500">v4 snapshot</p>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
          <li>Ingest curated benchmark and safety evidence for each model.</li>
          <li>Normalize reasoning, coding, chat, and safety scores onto the same 0–10 range.</li>
          <li>Blend the normalized subscores with fixed weights to produce the composite total.</li>
          <li>Publish a single snapshot feed that both the leaderboard and model pages consume.</li>
        </ul>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-slate-100">Scoring knobs</h2>
          <p className="text-xs uppercase tracking-wide text-slate-500">Fixed weights</p>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>
            Reasoning weight: <strong>{(SCORE_WEIGHTS.reasoning * 100).toFixed(0)}%</strong>
          </li>
          <li>
            Coding weight: <strong>{(SCORE_WEIGHTS.coding * 100).toFixed(0)}%</strong>
          </li>
          <li>
            Chat weight: <strong>{(SCORE_WEIGHTS.chat * 100).toFixed(0)}%</strong>
          </li>
          <li>
            Safety weight: <strong>{(SCORE_WEIGHTS.safety * 100).toFixed(0)}%</strong>
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          All totals and deltas adhere to the v4 schema, with no legacy model identifiers or versioned payloads.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-100">Transparency requirements</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          Every leaderboard entry links to evidence, keeping the simplified API surface auditable as the scoring inputs evolve.
        </p>
      </div>
    </div>
  );
}
