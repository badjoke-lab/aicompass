import { notFound } from "next/navigation";

import { getV4Model } from "../../lib/getV4Models";
import { calcDelta30 } from "../../lib/utils";

interface V4ModelPageProps {
  params: { slug: string };
}

export default function V4ModelDetailPage({ params }: V4ModelPageProps) {
  const model = getV4Model(params.slug);

  if (!model) {
    notFound();
  }

  const delta = calcDelta30(model.history);

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
          <p className="text-xs text-slate-500">Updated {new Date(model.updatedAt).toLocaleDateString()}</p>
          {delta && (
            <p className="text-xs font-semibold text-emerald-400">
              30d change: {delta.total >= 0 ? "+" : ""}
              {delta.total}
            </p>
          )}
        </div>
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
          <p className="text-xs uppercase tracking-wide text-slate-400">Subscores</p>
          <ul className="space-y-2 text-sm text-slate-200">
            <li className="flex items-center justify-between"><span>Evidence</span><span>{model.subscores.evidence}</span></li>
            <li className="flex items-center justify-between"><span>Velocity</span><span>{model.subscores.velocity}</span></li>
            <li className="flex items-center justify-between"><span>Adoption</span><span>{model.subscores.adoption}</span></li>
            <li className="flex items-center justify-between"><span>Stability</span><span>{model.subscores.stability}</span></li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
          <p className="text-xs uppercase tracking-wide text-slate-400">30-day change</p>
          {delta ? (
            <ul className="space-y-1 text-sm text-slate-200">
              <li className="flex items-center justify-between">
                <span>Total</span>
                <span className={delta.total >= 0 ? "text-emerald-400" : "text-amber-300"}>
                  {delta.total >= 0 ? "+" : ""}
                  {delta.total}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Evidence</span>
                <span className={delta.subscores.evidence >= 0 ? "text-emerald-400" : "text-amber-300"}>
                  {delta.subscores.evidence >= 0 ? "+" : ""}
                  {delta.subscores.evidence}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Velocity</span>
                <span className={delta.subscores.velocity >= 0 ? "text-emerald-400" : "text-amber-300"}>
                  {delta.subscores.velocity >= 0 ? "+" : ""}
                  {delta.subscores.velocity}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Adoption</span>
                <span className={delta.subscores.adoption >= 0 ? "text-emerald-400" : "text-amber-300"}>
                  {delta.subscores.adoption >= 0 ? "+" : ""}
                  {delta.subscores.adoption}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Stability</span>
                <span className={delta.subscores.stability >= 0 ? "text-emerald-400" : "text-amber-300"}>
                  {delta.subscores.stability >= 0 ? "+" : ""}
                  {delta.subscores.stability}
                </span>
              </li>
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Insufficient history for a 30-day delta.</p>
          )}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Evidence</h2>
        <ul className="space-y-3 text-sm text-slate-200">
          {model.evidence.map((item) => (
            <li key={item.label} className="rounded-lg border border-slate-800/80 bg-background/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-slate-50">{item.label}</div>
                {item.url && (
                  <a className="text-accent underline-offset-4 hover:underline" href={item.url} rel="noreferrer" target="_blank">
                    View source
                  </a>
                )}
              </div>
              {item.summary && <p className="text-xs text-slate-400">{item.summary}</p>}
              {item.lastUpdated && <p className="text-[0.7rem] text-slate-500">Updated {item.lastUpdated}</p>}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
