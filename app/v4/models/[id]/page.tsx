import { notFound } from "next/navigation";

import { getV4Model } from "../../lib/getV4Models";

interface V4ModelPageProps {
  params: { id: string };
}

export default function V4ModelDetailPage({ params }: V4ModelPageProps) {
  const model = getV4Model(params.id);

  if (!model) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v4</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">{model.name}</h1>
        <p className="text-sm text-slate-400">Vendor: {model.vendor}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total</p>
          <p className="text-3xl font-semibold text-accent">{model.total}</p>
          <p className="text-xs text-slate-500">Delta (30d): {model.delta30d >= 0 ? "+" : ""}{model.delta30d}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Subscores</p>
          <ul className="space-y-1 text-sm text-slate-200">
            <li className="flex items-center justify-between"><span>Quality</span><span>{model.subscores.quality}</span></li>
            <li className="flex items-center justify-between"><span>Speed</span><span>{model.subscores.speed}</span></li>
            <li className="flex items-center justify-between"><span>Cost</span><span>{model.subscores.cost}</span></li>
            <li className="flex items-center justify-between"><span>Safety</span><span>{model.subscores.safety}</span></li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800 bg-background/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Metadata</p>
          <ul className="space-y-1 text-sm text-slate-200">
            <li>
              <span className="text-slate-400">Modality: </span>
              <span>{model.modality.join(", ")}</span>
            </li>
            <li>
              <span className="text-slate-400">Updated: </span>
              <span>{new Date(model.updatedAt).toLocaleString()}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-background/70 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Evidence</h2>
        <ul className="space-y-2 text-sm text-slate-200">
          {model.evidence.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span className="text-slate-400">•</span>
              {item.url ? (
                <a className="text-accent hover:text-accent/80" href={item.url} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
