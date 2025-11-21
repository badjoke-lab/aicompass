import { v2ScoreEngine } from "@/lib/v2";
import type { V2ModelWithMetrics } from "@/lib/v2";

export const metadata = {
  title: "AIMS v2 · Leaderboard"
};

export default function V2LeaderboardPage() {
  const snapshots = v2ScoreEngine.getSnapshots();
  const ranked = [...snapshots].sort((a, b) => b.metrics.total - a.metrics.total);
  const generatedAt = new Date().toISOString();

  const momentumLeaders = [...snapshots]
    .sort((a, b) => b.metrics.weightedDelta.value - a.metrics.weightedDelta.value)
    .slice(0, 5);
  const velocityWatch = [...snapshots]
    .sort((a, b) => a.metrics.trendVelocity.velocity - b.metrics.trendVelocity.velocity)
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2 prototype</p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-50">Leaderboard snapshot</h1>
          <p className="text-sm text-slate-400">
            Read-only ranking powered exclusively by the aims v2 scoring engine. All metrics and summaries below reuse the v2
            volatility, transparency, ecosystem depth, and weighted delta logic with no v1 dependencies.
          </p>
        </div>
        <p className="text-[0.75rem] uppercase tracking-wide text-slate-500">Generated {generatedAt}</p>
      </header>

      <section className="rounded-3xl border border-slate-800 bg-surface/80 p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-widest text-slate-500">Tracked models</p>
            <p className="text-2xl font-semibold text-slate-50">{ranked.length} entries</p>
          </div>
          <div className="text-sm text-slate-400">
            Weighted delta uses adoption, performance, and stability penalties from v2. Trend velocity reflects the trailing
            window used by the score engine.
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Rank</th>
                <th className="px-4 py-3 font-semibold">Model</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Weighted Δ</th>
                <th className="px-4 py-3 font-semibold">Velocity</th>
                <th className="px-4 py-3 font-semibold">Transparency</th>
                <th className="px-4 py-3 font-semibold">Ecosystem depth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {ranked.map((entry, index) => (
                <LeaderboardRow key={entry.model.slug} entry={entry} rank={index + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <MetricSparkbars
          title="Weights"
          helper="Adoption and performance weights applied to weighted Δ"
          data={ranked}
          getValue={(entry) => (entry.metrics.weightedDelta.adoptionWeight + entry.metrics.weightedDelta.performanceWeight) / 2}
          format={(value) => `${(value * 100).toFixed(0)}% weight`}
        />
        <MetricSparkbars
          title="Weighted delta"
          helper="Momentum adjusted for stability and velocity boosts"
          data={ranked}
          getValue={(entry) => entry.metrics.weightedDelta.value}
          format={(value) => value.toFixed(2)}
        />
        <MetricSparkbars
          title="Trend velocity"
          helper="Per-week change using the v2 trailing window"
          data={ranked}
          getValue={(entry) => entry.metrics.trendVelocity.velocity}
          format={(value) => `${value.toFixed(2)} /wk`}
        />
        <MetricSparkbars
          title="Transparency ratio"
          helper="Compliance vs disclosure expectation"
          data={ranked}
          getValue={(entry) => entry.metrics.transparencyCompliance.ratio}
          format={(value) => `${(value * 100).toFixed(0)}%`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TopMovers title="Top momentum" description="Highest weighted delta" movers={momentumLeaders} positive />
        <TopMovers title="Velocity watch" description="Lowest current velocity" movers={velocityWatch} />
      </section>
    </div>
  );
}

function LeaderboardRow({ entry, rank }: { entry: V2ModelWithMetrics; rank: number }) {
  const { metrics } = entry;
  const transparencyPercent = Math.round(metrics.transparencyCompliance.ratio * 100);
  const ecosystemPercent = Math.min(120, metrics.ecosystemDepth.depth) / 120;
  const velocityColor = metrics.trendVelocity.velocity >= 0 ? "text-positive" : "text-negative";

  return (
    <tr className="bg-gradient-to-r from-slate-950/40 to-slate-900/20">
      <td className="px-4 py-4 text-sm font-semibold text-slate-400">#{rank}</td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-100">{metrics.name}</span>
          <span className="text-xs uppercase tracking-wide text-slate-500">{metrics.vendor}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-lg font-semibold text-slate-50">{metrics.total.toFixed(1)}</td>
      <td className="px-4 py-4">
        <div className="font-mono text-base text-slate-50">{metrics.weightedDelta.value.toFixed(2)}</div>
        <p className="text-xs text-slate-500">
          raw Δ {metrics.weightedDelta.rawDelta.toFixed(1)} · stability ×{metrics.weightedDelta.stabilityPenalty.toFixed(2)}
        </p>
      </td>
      <td className="px-4 py-4">
        <div className={`font-semibold ${velocityColor}`}>{metrics.trendVelocity.velocity.toFixed(2)} /wk</div>
        <p className="text-xs text-slate-500">Δ {metrics.trendVelocity.delta.toFixed(1)} over {metrics.trendVelocity.windowDays}d</p>
      </td>
      <td className="px-4 py-4">
        <div className="font-semibold text-slate-50">{transparencyPercent}%</div>
        <p className="text-xs text-slate-500">transparency vs disclosure</p>
        <RatioBar ratio={metrics.transparencyCompliance.ratio} />
      </td>
      <td className="px-4 py-4 text-sm text-slate-200">
        <div className="font-semibold">{metrics.ecosystemDepth.depth.toFixed(1)} pts</div>
        <p className="text-xs text-slate-500">{metrics.ecosystemDepth.evidenceSignals} signals</p>
        <RatioBar ratio={ecosystemPercent} accent="bg-emerald-400" />
      </td>
    </tr>
  );
}

function MetricSparkbars({
  title,
  helper,
  data,
  getValue,
  format
}: {
  title: string;
  helper: string;
  data: V2ModelWithMetrics[];
  getValue: (entry: V2ModelWithMetrics) => number;
  format: (value: number) => string;
}) {
  const sorted = [...data].sort((a, b) => getValue(b) - getValue(a)).slice(0, 8);
  const maxValue = Math.max(...sorted.map(getValue).map(Math.abs), 1);

  return (
    <article className="rounded-3xl border border-slate-800 bg-surface/80 p-4 shadow-inner">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-widest text-slate-500">{title}</p>
          <p className="text-xs text-slate-500">{helper}</p>
        </div>
        <span className="text-xs text-slate-500">Top 8</span>
      </div>
      <div className="mt-4 space-y-3">
        {sorted.map((entry) => {
          const value = getValue(entry);
          const width = `${(Math.abs(value) / maxValue) * 100}%`;
          const positive = value >= 0;
          const barColor = positive ? "bg-accent" : "bg-rose-400";

          return (
            <div key={entry.model.slug} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                <span className="truncate font-semibold text-slate-200">{entry.metrics.name}</span>
                <span className="font-mono text-slate-300">{format(value)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-900">
                <div className={`h-2 rounded-full ${barColor}`} style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function TopMovers({
  title,
  description,
  movers,
  positive = false
}: {
  title: string;
  description: string;
  movers: V2ModelWithMetrics[];
  positive?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-surface/80 p-5 shadow-inner">
      <div className="space-y-1">
        <p className="text-[0.65rem] uppercase tracking-widest text-slate-500">{title}</p>
        <h3 className="text-xl font-semibold text-slate-50">{description}</h3>
        <p className="text-xs text-slate-500">Static snapshot using v2 weighted delta and velocity helpers.</p>
      </div>
      <div className="mt-4 space-y-3">
        {movers.map((entry) => {
          const velocity = entry.metrics.trendVelocity.velocity;
          const delta = entry.metrics.weightedDelta.value;
          const velocityColor = velocity >= 0 ? "text-positive" : "text-negative";
          const deltaColor = delta >= 0 ? "text-positive" : "text-negative";

          return (
            <div key={entry.model.slug} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3">
              <div className="flex items-center justify-between gap-2 text-sm text-slate-200">
                <span className="font-semibold">{entry.metrics.name}</span>
                <span className="text-xs uppercase tracking-wide text-slate-500">{entry.metrics.vendor}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className={`font-semibold ${deltaColor}`}>{delta.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">weighted Δ</p>
                </div>
                <div>
                  <p className={`font-semibold ${velocityColor}`}>{velocity.toFixed(2)} /wk</p>
                  <p className="text-xs text-slate-500">trend velocity</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Transparency {(entry.metrics.transparencyCompliance.ratio * 100).toFixed(0)}% · Ecosystem {entry.metrics.ecosystemDepth.depth.toFixed(1)} pts
              </div>
            </div>
          );
        })}
      </div>
      {positive ? (
        <p className="mt-3 text-xs text-slate-500">
          Momentum here already includes adoption and performance weights; no manual adjustments added to this view.
        </p>
      ) : null}
    </article>
  );
}

function RatioBar({ ratio, accent = "bg-accent" }: { ratio: number; accent?: string }) {
  const width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
  return (
    <div className="mt-2">
      <div className="h-2 w-full rounded-full bg-slate-900">
        <div className={`h-2 rounded-full ${accent}`} style={{ width }} />
      </div>
    </div>
  );
}
