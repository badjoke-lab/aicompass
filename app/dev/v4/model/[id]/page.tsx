import { DEV_V4_API_BASE } from "@/lib/v4/config";

import type { ScoringResponse, V4ModelScore } from "../../types";

export const dynamic = "force-dynamic";

const DELTA_FALLBACK = {
  total: 0,
  reasoning: 0,
  coding: 0,
  chat: 0,
  safety: 0,
};

async function fetchModel(id: string): Promise<V4ModelScore | null> {
  try {
    const response = await fetch(`${DEV_V4_API_BASE}/model/${id}`, { cache: "no-store" });
    if (!response.ok) return null;

    const data = (await response.json()) as ScoringResponse;
    const models = data?.status === "ok" ? (data.models as V4ModelScore[] | undefined) ?? [] : [];

    return models.find((entry) => entry.id === id || entry.slug === id) ?? null;
  } catch (error) {
    console.error(`Failed to load v4 model ${id}`, error);
    return null;
  }
}

interface V4ModelPageProps {
  params: { id: string };
}

export default async function V4ModelDetailPage({ params }: V4ModelPageProps) {
  const model = await fetchModel(params.id);

  if (!model) {
    return (
      <div className="space-y-4 rounded-xl border border-slate-800 bg-background/70 p-6 text-center text-slate-200">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v4 dev</p>
        <h1 className="text-2xl font-semibold text-slate-50">Model details unavailable</h1>
        <p className="text-sm text-slate-400">We couldn&apos;t load this entry from the live scoring pipeline.</p>
        <a className="text-accent underline-offset-4 hover:underline" href="/dev/v4">
          Return to the v4 dev leaderboard
        </a>
      </div>
    );
  }

  const delta = model.delta30d ?? DELTA_FALLBACK;
  const evidence = model.evidence ?? [];

  return (
    <article className="space-y-7">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v4</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">{model.name}</h1>
        <p className="text-sm text-slate-400">{model.vendor} · {model.modality.join(", ")}</p>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300">{model.summary}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total</p>
          <p className="text-4xl font-semibold text-accent">{model.total}</p>
          <p className="text-xs text-slate-500">Updated {new Date(model.updated).toLocaleDateString()}</p>
          <p className={`text-xs font-semibold ${delta.total >= 0 ? "text-emerald-400" : "text-amber-300"}`}>
            30d change: {delta.total >= 0 ? "+" : ""}
            {delta.total}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
          <p className="text-xs uppercase tracking-wide text-slate-400">Subscores</p>
          <ul className="space-y-2 text-sm text-slate-200">
            <li className="flex items-center justify-between"><span>Reasoning</span><span>{model.subscores.reasoning}</span></li>
            <li className="flex items-center justify-between"><span>Coding</span><span>{model.subscores.coding}</span></li>
            <li className="flex items-center justify-between"><span>Chat</span><span>{model.subscores.chat}</span></li>
            <li className="flex items-center justify-between"><span>Safety</span><span>{model.subscores.safety}</span></li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
          <p className="text-xs uppercase tracking-wide text-slate-400">30-day change</p>
          <ul className="space-y-1 text-sm text-slate-200">
            <li className="flex items-center justify-between">
              <span>Total</span>
              <span className={delta.total >= 0 ? "text-emerald-400" : "text-amber-300"}>
                {delta.total >= 0 ? "+" : ""}
                {delta.total}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Reasoning</span>
              <span className={delta.reasoning >= 0 ? "text-emerald-400" : "text-amber-300"}>
                {delta.reasoning >= 0 ? "+" : ""}
                {delta.reasoning}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Coding</span>
              <span className={delta.coding >= 0 ? "text-emerald-400" : "text-amber-300"}>
                {delta.coding >= 0 ? "+" : ""}
                {delta.coding}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Chat</span>
              <span className={delta.chat >= 0 ? "text-emerald-400" : "text-amber-300"}>
                {delta.chat >= 0 ? "+" : ""}
                {delta.chat}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Safety</span>
              <span className={delta.safety >= 0 ? "text-emerald-400" : "text-amber-300"}>
                {delta.safety >= 0 ? "+" : ""}
                {delta.safety}
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Evidence</h2>
        {evidence.length === 0 ? (
          <p className="text-sm text-slate-400">No evidence available for this model yet.</p>
        ) : (
          <ul className="space-y-3 text-sm text-slate-200">
            {evidence.map((item) => (
              <li key={item.title} className="rounded-lg border border-slate-800/80 bg-background/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-50">{item.title}</div>
                  {item.url && (
                    <a className="text-accent underline-offset-4 hover:underline" href={item.url} rel="noreferrer" target="_blank">
                      View source
                    </a>
                  )}
                </div>
                {item.summary && <p className="text-xs text-slate-400">{item.summary}</p>}
                {item.date && <p className="text-[0.7rem] text-slate-500">Updated {item.date}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
