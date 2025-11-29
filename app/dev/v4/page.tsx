import Link from "next/link";

import { computeLeaderboard } from "./data/compute";
import { getV4Models } from "./lib/getV4Models";
import { sortModels } from "./lib/utils";

export default function V4HomePage() {
  const models = sortModels(computeLeaderboard(getV4Models()), "total-desc");

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v4 dev</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">
          AI Model Scoreboard v4 (dev)
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
          Stable mock leaderboard using the v4 data model. This area is isolated from v3 and ready for iterative
          polishing.
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
              <th className="px-3 py-3 text-right">Δ30d</th>
              <th className="px-3 py-3 text-right">Reasoning</th>
              <th className="px-3 py-3 text-right">Coding</th>
              <th className="px-3 py-3 text-right">Chat</th>
              <th className="px-3 py-3 text-right">Safety</th>
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
                  <Link className="text-accent hover:text-accent/80" href={`/dev/v4/model/${model.slug}`}>
                    {model.name}
                  </Link>
                </td>
                <td className="px-3 py-4 text-slate-200 sm:py-3">{model.vendor}</td>
                <td className="px-3 py-4 text-slate-300 sm:py-3">{model.modality.join(", ")}</td>
                <td className="px-3 py-4 text-right font-semibold text-accent sm:py-3">{model.total}</td>
                <td
                  className={`px-3 py-4 text-right sm:py-3 ${
                    model.delta30d >= 0 ? "text-emerald-400" : "text-amber-300"
                  }`}
                >
                  {model.delta30d >= 0 ? "+" : ""}
                  {model.delta30d}
                </td>
                <td className="px-3 py-4 text-right text-slate-100 sm:py-3">{model.subscores.reasoning}</td>
                <td className="px-3 py-4 text-right text-slate-100 sm:py-3">{model.subscores.coding}</td>
                <td className="px-3 py-4 text-right text-slate-100 sm:py-3">{model.subscores.chat}</td>
                <td className="px-3 py-4 text-right text-slate-100 sm:py-3">{model.subscores.safety}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
