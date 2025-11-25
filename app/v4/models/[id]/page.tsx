import Link from "next/link";
import { notFound } from "next/navigation";

import { MOCK_MODELS } from "../../lib/mockModels";
import { ModelV4 } from "../../lib/types";
import { calcDelta30, getModelById } from "../../lib/utils";

interface ModelPageProps {
  params: { id: string };
}

const SUBSCORE_COPY: Record<keyof ModelV4["subscores"], string> = {
  reasoning: "Complex reasoning and planning",
  coding: "Code synthesis and debugging",
  math: "Math and quantitative tasks",
  multimodal: "Image / video understanding",
  safety: "Guardrails and alignment",
};

export function generateStaticParams() {
  return MOCK_MODELS.map((model) => ({ id: model.id }));
}

function formatDelta(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}

function sortHistory(history?: ModelV4["history"]) {
  return (history ?? []).slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default function ModelDetailPage({ params }: ModelPageProps) {
  const model = getModelById(params.id);

  if (!model) {
    return notFound();
  }

  const history = sortHistory(model.history);
  const delta = calcDelta30(history);
  const recentTotals = history.slice(-5).map((entry) => entry.total);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3 text-sm text-emerald-200">
        <Link
          href="/v4"
          className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 px-3 py-1 text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-950"
        >
          ← Back to v4 leaderboard
        </Link>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-emerald-900/40 bg-emerald-950/40 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-emerald-200/80">{model.vendor.name}</p>
            <h1 className="text-3xl font-bold text-white">{model.name}</h1>
            <div className="flex flex-wrap gap-2">
              {model.modality.map((mod) => (
                <span key={mod} className="rounded-full bg-emerald-900/60 px-3 py-1 text-xs font-semibold capitalize text-emerald-100">
                  {mod}
                </span>
              ))}
            </div>
            <p className="text-xs text-emerald-200/70">Updated at {model.updatedAt}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-emerald-300/80">Total</p>
            <p className="text-5xl font-bold text-white">{model.total.toFixed(1)}</p>
            <p className="text-sm text-emerald-100">30d delta: {formatDelta(delta?.total)}</p>
          </div>
        </div>
        <div className="text-sm text-emerald-100/80">
          {recentTotals.length ? (
            <p>
              last 5 totals: {recentTotals.join(" → ")}
            </p>
          ) : (
            <p>No history yet</p>
          )}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Subscores</p>
                <p className="text-sm text-slate-300">Key capabilities snapshot</p>
              </div>
              <p className="text-xs text-slate-400">30-day deltas shown per metric</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {(Object.keys(SUBSCORE_COPY) as (keyof ModelV4["subscores"])[]).map((key) => (
                <div key={key} className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{key}</p>
                  <p className="text-2xl font-bold text-white">{model.subscores[key].toFixed(1)}</p>
                  <p className="text-sm text-slate-200">Δ30: {formatDelta(delta?.subscores[key])}</p>
                  <p className="pt-2 text-xs text-slate-400">{SUBSCORE_COPY[key]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recent trajectory</p>
            <p className="mt-2 text-sm text-slate-200">
              {recentTotals.length
                ? `Recent totals over time: ${recentTotals.join(" → ")}`
                : "No history yet"}
            </p>
            <p className="mt-1 text-xs text-slate-400">Showing up to the last 5 recorded points.</p>
          </section>
        </div>

        <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Evidence</p>
          </div>
          {model.evidence.length === 0 ? (
            <p className="text-sm text-slate-200">No evidence yet</p>
          ) : (
            <ul className="space-y-4">
              {model.evidence.map((item) => (
                <li key={`${item.label}-${item.updatedAt}`} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener"
                      className="font-semibold text-emerald-200 hover:underline"
                    >
                      {item.label}
                    </a>
                    {item.type && (
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-xs capitalize text-slate-200">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Updated: {item.updatedAt}</p>
                  {item.note && <p className="text-xs text-slate-300">{item.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
