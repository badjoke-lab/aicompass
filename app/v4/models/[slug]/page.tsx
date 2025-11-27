import { notFound } from "next/navigation";

import { computeModelScore } from "../../data/compute";
import { getV4Model } from "../../lib/getV4Models";

interface V4ModelPageProps {
  params: { slug: string };
}

export default function V4ModelDetailPage({ params }: V4ModelPageProps) {
  const modelInput = getV4Model(params.slug);

  if (!modelInput) {
    notFound();
  }

  const model = computeModelScore(modelInput);

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
          <p className={`text-xs font-semibold ${model.delta30d >= 0 ? "text-emerald-400" : "text-amber-300"}`}>
            30d change: {model.delta30d >= 0 ? "+" : ""}
            {model.delta30d}
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
              <span className={model.delta30d >= 0 ? "text-emerald-400" : "text-amber-300"}>
                {model.delta30d >= 0 ? "+" : ""}
                {model.delta30d}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Reasoning</span>
              <span className="text-emerald-400">+{(model.subscores.reasoning * 0.02).toFixed(1)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Coding</span>
              <span className="text-emerald-400">+{(model.subscores.coding * 0.02).toFixed(1)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Chat</span>
              <span className="text-emerald-400">+{(model.subscores.chat * 0.02).toFixed(1)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Safety</span>
              <span className="text-amber-300">-{(model.subscores.safety * 0.01).toFixed(1)}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-background/70 p-4 shadow">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Evidence</h2>
        <ul className="space-y-3 text-sm text-slate-200">
          {model.evidence.map((item) => (
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
      </section>
    </article>
  );
}
