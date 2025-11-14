import modelsData from "@/data/models/index.json";
import ModelCard, { type Model } from "@/components/ModelCard";

const models = modelsData as Model[];

function getSpikes(models: Model[]) {
  const gainers = models
    .filter((m) => m.delta >= 3 && !m.waiting)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);

  const droppers = models
    .filter((m) => m.delta <= -3 && !m.waiting)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 3);

  return { gainers, droppers };
}

export default function ScoresPage() {
  const sorted = [...models].sort((a, b) => b.total - a.total);
  const top10 = sorted.slice(0, 10);
  const rest = sorted.slice(10);
  const { gainers, droppers } = getSpikes(models);

  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-3">
        <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
          AI model scores
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Compare major AI models at a glance. Scores are updated periodically.
          Every score is backed by public evidence and a transparent method.
        </p>
        <p className="text-xs text-slate-500">
          Last update: 2025-11-01 · Δ window: 30 days
        </p>
      </section>

      {/* PC: grid, Mobile: stacked */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Ranking
        </h2>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {top10.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>

        {rest.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">
              Other models
            </p>
            <div className="space-y-1 rounded-xl border border-slate-800 bg-surface/60 p-3 text-xs">
              {rest.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-100">
                      {model.name}
                    </span>
                    <span className="text-[0.7rem] text-slate-500">
                      {model.provider}
                    </span>
                  </div>
                  <div className="text-right text-[0.7rem]">
                    <div className="text-slate-400">
                      Total {model.total.toFixed(1)}
                    </div>
                    <div
                      className={
                        model.delta > 0
                          ? "text-positive"
                          : model.delta < 0
                            ? "text-negative"
                            : "text-slate-400"
                      }
                    >
                      Δ {model.delta > 0 ? "+" : ""}
                      {model.delta.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Recent spikes
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-surface/60 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-positive">
              Top gainers
            </h3>
            <div className="mt-2 space-y-2 text-xs">
              {gainers.length === 0 && (
                <p className="text-slate-500">No strong gainers this period.</p>
              )}
              {gainers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg bg-positive/5 px-2 py-1"
                >
                  <div>
                    <div className="font-medium text-slate-50">{m.name}</div>
                    <div className="text-[0.65rem] text-slate-400">
                      {m.provider}
                    </div>
                  </div>
                  <div className="text-right text-[0.65rem] text-positive">
                    +{m.delta.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-surface/60 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-negative">
              Top droppers
            </h3>
            <div className="mt-2 space-y-2 text-xs">
              {droppers.length === 0 && (
                <p className="text-slate-500">No strong drops this period.</p>
              )}
              {droppers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg bg-negative/5 px-2 py-1"
                >
                  <div>
                    <div className="font-medium text-slate-50">{m.name}</div>
                    <div className="text-[0.65rem] text-slate-400">
                      {m.provider}
                    </div>
                  </div>
                  <div className="text-right text-[0.65rem] text-negative">
                    {m.delta.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[0.65rem] text-slate-500">
          Spike ↑ / ↓ are based on total score change ≥ +3.0 / ≤ -3.0 over the
          last 30 days.
        </p>
      </section>
    </div>
  );
}
