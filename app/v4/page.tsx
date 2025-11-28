import Link from "next/link";

import { getV4Models } from "./lib/getV4Models";
import { sortModels } from "./lib/utils";

export default function V4HomePage() {
  const models = sortModels(getV4Models(), "total-desc");

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v4</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">AI Model Scoreboard v4 (draft)</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
          Stable mock leaderboard using the v4 data model. This area is isolated from v3 and ready for iterative polishing.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface/80 shadow-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-background/60 text-[0.7rem] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-3 text-left">Rank</th>
              <th className="px-3 py-3 text-left">Model</th>
              <th className="px-3 py-3 text-left">Vendor</th>
              <th className="px-3 py-3 text-left">Modality</th>
              <th className="px-3 py-3 text-right">Total</th>
              <th className="px-3 py-3 text-right">Popularity</th>
              <th className="px-3 py-3 text-right">Recency</th>
              <th className="px-3 py-3 text-right">Credibility</th>
              <th className="px-3 py-3 text-right">30d Δ</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, index) => (
              <tr
                key={model.id}
                className="border-t border-slate-800/70 bg-background/30 transition hover:bg-background/60"
              >
                <td className="px-3 py-4 text-right text-slate-500 sm:py-3">{index + 1}</td>
                <td className="px-3 py-4 font-semibold text-slate-50 sm:py-3">
                  <Link className="text-accent hover:text-accent/80" href={`/v4/models/${model.slug}`}>
                    {model.name}
                  </Link>
                </td>
                <td className="px-3 py-4 text-slate-200 sm:py-3">{model.vendor}</td>
                <td className="px-3 py-4 text-slate-300 sm:py-3">{model.modality}</td>
                <td className="px-3 py-4 text-right font-semibold text-accent sm:py-3">{model.total.toFixed(1)}</td>
                <td className="px-3 py-4 text-right text-slate-100 sm:py-3">{model.popularity}</td>
                <td className="px-3 py-4 text-right text-slate-100 sm:py-3">{model.recency}</td>
                <td className="px-3 py-4 text-right text-slate-100 sm:py-3">{model.credibility}</td>
                <td
                  className={`px-3 py-4 text-right sm:py-3 ${
                    model.delta30d >= 0 ? "text-emerald-400" : "text-amber-300"
                  }`}
                >
                  {model.delta30d >= 0 ? "+" : ""}
                  {model.delta30d.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
