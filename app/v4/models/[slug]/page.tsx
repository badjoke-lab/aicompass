import { notFound } from "next/navigation";

import { getV4Model } from "../../lib/getV4Models";

interface V4ModelPageProps {
  params: { slug: string };
}

export default function V4ModelDetailPage({ params }: V4ModelPageProps) {
  const model = getV4Model(params.slug);

  if (!model) {
    notFound();
  }

  return (
    <article className="space-y-7">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v4</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">{model.name}</h1>
        <p className="text-sm text-slate-400">{model.vendor} · {model.modality}</p>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
          Early view of computed v4 scoring using mock history and evidence inputs.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total</p>
          <p className="text-4xl font-semibold text-accent">{model.total.toFixed(1)}</p>
          <p className="text-xs text-slate-500">Latest history point {model.history[model.history.length - 1].date}</p>
          <p className={`text-xs font-semibold ${model.delta30d >= 0 ? "text-emerald-400" : "text-amber-300"}`}>
            30d change: {model.delta30d >= 0 ? "+" : ""}
            {model.delta30d.toFixed(1)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
          <p className="text-xs uppercase tracking-wide text-slate-400">Subscores</p>
          <ul className="space-y-2 text-sm text-slate-200">
            <li className="flex items-center justify-between"><span>Popularity</span><span>{model.popularity}</span></li>
            <li className="flex items-center justify-between"><span>Recency</span><span>{model.recency}</span></li>
            <li className="flex items-center justify-between"><span>Credibility</span><span>{model.credibility}</span></li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
          <p className="text-xs uppercase tracking-wide text-slate-400">30-day change</p>
          <ul className="space-y-1 text-sm text-slate-200">
            <li className="flex items-center justify-between">
              <span>Total</span>
              <span className={model.delta30d >= 0 ? "text-emerald-400" : "text-amber-300"}>
                {model.delta30d >= 0 ? "+" : ""}
                {model.delta30d.toFixed(1)}
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Evidence</h2>
        <ul className="space-y-3 text-sm text-slate-200">
          {model.evidence.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-800/80 bg-background/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-slate-50">{item.source}</div>
                <span className="text-xs text-slate-400">Score {item.value}</span>
              </div>
              {item.note && <p className="text-xs text-slate-400">{item.note}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">History</h2>
        <ul className="space-y-2 text-sm text-slate-200">
          {model.history.map((point) => (
            <li key={point.date} className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-background/60 p-3">
              <span>{point.date}</span>
              <span className="font-semibold text-accent">{point.score}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
