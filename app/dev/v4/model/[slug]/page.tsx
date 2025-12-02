import Link from "next/link";

import { getV4Snapshot } from "@/app/dev/v4/fetchers";

export const dynamic = "force-dynamic";

export default async function V4ModelDetailPage({ params }: { params: { slug: string } }) {
  const snapshot = await getV4Snapshot();
  const model = snapshot.models.find((entry) => entry.slug === params.slug);

  if (!model) {
    return (
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">AIMS · v4</p>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">Model details unavailable</h1>
        <p className="text-sm text-slate-400">The requested model is not present in the latest snapshot.</p>
        <Link href="/dev/v4" className="text-sm font-semibold text-accent underline">
          ← Back to leaderboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">AIMS · v4</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">{model.name}</h1>
            <p className="text-sm text-slate-400">Vendor: {model.vendor}</p>
            <p className="text-sm text-slate-400">Modalities: {model.modality.join(", ")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-800 bg-background/70 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-400">{model.summary}</p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="rounded-full border border-slate-800 px-3 py-1">Updated: {new Date(model.updatedAt).toLocaleString()}</span>
          <span className="rounded-full border border-slate-800 px-3 py-1">Snapshot updated: {snapshot.updated ?? "—"}</span>
          <span className="rounded-full border border-slate-800 px-3 py-1">Δ 30d: {model.delta30d.total.toFixed(1)}</span>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total" value={model.total.toFixed(1)} helper="Composite" />
        <MetricCard label="Reasoning" value={model.subscores.reasoning.toFixed(1)} helper="Subscore" />
        <MetricCard label="Coding" value={model.subscores.coding.toFixed(1)} helper="Subscore" />
        <MetricCard label="Chat" value={model.subscores.chat.toFixed(1)} helper="Subscore" />
        <MetricCard label="Safety" value={model.subscores.safety.toFixed(1)} helper="Subscore" />
        <MetricCard label="Δ 30d (total)" value={model.delta30d.total.toFixed(1)} helper="Momentum" />
        <MetricCard label="Δ 30d (reasoning)" value={model.delta30d.reasoning.toFixed(1)} helper="Momentum" />
        <MetricCard label="Δ 30d (coding)" value={model.delta30d.coding.toFixed(1)} helper="Momentum" />
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-surface/80 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Evidence</h2>
            <p className="text-xs text-slate-500">Signals backing the current placement.</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-200">
          {model.evidence.map((item) => (
            <div key={`${item.title}-${item.date}`} className="rounded-xl border border-slate-800/80 bg-background/60 px-4 py-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-slate-50">{item.title}</p>
                <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
              </div>
              {item.url && (
                <a className="text-xs text-accent underline" href={item.url} target="_blank" rel="noreferrer">
                  View source
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <Link href="/dev/v4" className="text-sm font-semibold text-accent underline">
        ← Back to leaderboard
      </Link>
    </div>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-background/60 px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-50">{value}</p>
      <p className="text-[0.7rem] text-slate-500">{helper}</p>
    </div>
  );
}
