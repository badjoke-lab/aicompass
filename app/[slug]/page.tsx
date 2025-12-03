import Link from "next/link";
import { notFound } from "next/navigation";

import { getScore } from "@/lib/fetchers";
import type { V4Model } from "@/types/v4";

function formatDelta(value: number): string {
  const fixed = value.toFixed(1);
  if (value > 0) return `+${fixed}`;
  if (value < 0) return fixed;
  return "0.0";
}

export const dynamic = "force-dynamic";

export default async function ModelDetailPage({ params }: { params: { slug: string } }) {
  const model = await getScore(params.slug);

  if (!model) {
    return notFound();
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">AIMS · v4</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">{model.name}</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-400">{model.summary}</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full border border-slate-800 px-3 py-1 font-semibold uppercase tracking-wide text-slate-300">
                {model.vendor}
              </span>
              {model.modality.map((item) => (
                <span key={item} className="rounded-full border border-slate-800 px-3 py-1 text-slate-400">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="self-start rounded-2xl border border-slate-800 bg-background/70 px-4 py-3 text-sm text-slate-300 shadow-xl">
            <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">Composite</p>
            <p className="text-3xl font-semibold text-slate-50">{model.total.toFixed(1)}</p>
            <p className={model.delta30d.total >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {formatDelta(model.delta30d.total)} over 30 days
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard label="Reasoning" value={model.subscores.reasoning} delta={model.delta30d.reasoning} />
        <ScoreCard label="Coding" value={model.subscores.coding} delta={model.delta30d.coding} />
        <ScoreCard label="Chat" value={model.subscores.chat} delta={model.delta30d.chat} />
        <ScoreCard label="Safety" value={model.subscores.safety} delta={model.delta30d.safety} />
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-800 bg-surface/80 p-4 shadow-xl sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Evidence</h2>
            <p className="text-xs text-slate-500">Signals and reports attached to the v4 scorecard.</p>
          </div>
          <span className="text-xs text-slate-500">Updated {new Date(model.updated).toLocaleString()}</span>
        </div>
        <div className="space-y-3">
          {model.evidence.map((item) => (
            <EvidenceRow key={`${item.title}-${item.date}`} item={item} />
          ))}
        </div>
      </section>

      <Link href="/" className="text-sm font-semibold text-accent underline">
        ← Back to leaderboard
      </Link>
    </div>
  );
}

function ScoreCard({ label, value, delta }: { label: string; value: number; delta: number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-background/60 px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-50">{value.toFixed(1)}</p>
      <p className={delta >= 0 ? "text-emerald-400" : "text-rose-400"}>{formatDelta(delta)} vs 30d</p>
    </div>
  );
}

function EvidenceRow({ item }: { item: V4Model["evidence"][number] }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-slate-800/70 bg-background/50 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-200">{item.title}</p>
        <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
      </div>
      {item.url && (
        <Link href={item.url} className="text-xs font-semibold uppercase tracking-wide text-accent hover:text-accent/80" target="_blank" rel="noreferrer">
          View source
        </Link>
      )}
    </div>
  );
}
