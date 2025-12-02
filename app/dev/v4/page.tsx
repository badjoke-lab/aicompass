import Link from "next/link";

import type { V4ModelEntry } from "@/lib/v4/types";

import { getV4Snapshot } from "./fetchers";

function formatDelta(value: number): string {
  const fixed = value.toFixed(1);
  if (value > 0) return `+${fixed}`;
  if (value < 0) return fixed;
  return "0.0";
}

export const dynamic = "force-dynamic";

export default async function V4LeaderboardPage() {
  const snapshot = await getV4Snapshot();
  const models = [...snapshot.models].sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">AIMS · v4</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">Live Leaderboard</h1>
          <p className="text-xs text-slate-500">Snapshot updated: {snapshot.updated ?? "—"}</p>
        </div>
        <p className="max-w-3xl text-sm text-slate-400">
          Ranks are calculated from the snapshot feed and prioritize composite performance alongside recent momentum.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-background/70 shadow-xl">
        <div className="grid grid-cols-9 bg-surface px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-wide text-slate-400">
          <span>#</span>
          <span className="col-span-2">Model</span>
          <span>Vendor</span>
          <span>Total</span>
          <span>Δ 30d</span>
          <span>Reasoning</span>
          <span>Coding</span>
          <span>Chat</span>
          <span>Safety</span>
        </div>
        <div className="divide-y divide-slate-800/80">
          {models.map((model, index) => (
            <LeaderboardRow key={model.id} model={model} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LeaderboardRow({ model, rank }: { model: V4ModelEntry; rank: number }) {
  return (
    <div className="grid grid-cols-9 items-center px-4 py-3 text-sm text-slate-200 hover:bg-surface">
      <span className="text-sm font-semibold text-slate-500">{rank}</span>
      <div className="col-span-2">
        <Link href={`/dev/v4/model/${model.slug}`} className="font-semibold text-accent hover:text-accent/80">
          {model.name}
        </Link>
        <div className="flex flex-wrap gap-1 text-[0.7rem] text-slate-500">
          {model.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-800 px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <span className="text-slate-400">{model.vendor}</span>
      <span className="font-semibold text-slate-50">{model.total.toFixed(1)}</span>
      <span className={model.delta30d.total >= 0 ? "text-emerald-400" : "text-rose-400"}>
        {formatDelta(model.delta30d.total)}
      </span>
      <span>{model.subscores.reasoning.toFixed(1)}</span>
      <span>{model.subscores.coding.toFixed(1)}</span>
      <span>{model.subscores.chat.toFixed(1)}</span>
      <span>{model.subscores.safety.toFixed(1)}</span>
    </div>
  );
}
