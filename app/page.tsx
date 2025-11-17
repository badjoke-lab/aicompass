import ModelCard from "@/components/ModelCard";
import ModelRollup from "@/components/ModelRollup";
import StatsBar from "@/components/StatsBar";
import {
  DELTA_WINDOW_DAYS,
  getLeaderboard,
  getModels,
  getSpikes,
  getSummaryStats
} from "@/lib/models";

const models = getModels();
const { leaders: top10, rest } = getLeaderboard(10, models);
const { gainers, droppers } = getSpikes(models);
const stats = getSummaryStats(models);
const lastUpdatedLabel = formatDate(stats.lastUpdated);

export default function ScoresPage() {
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
          Last update: {lastUpdatedLabel ?? "TBD"} · Δ window: {DELTA_WINDOW_DAYS}
          {" "}days
        </p>
      </section>

      <StatsBar stats={stats} windowDays={DELTA_WINDOW_DAYS} />

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
              Other tracked models
            </p>
            <ModelRollup models={rest} offset={top10.length} />
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

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}
