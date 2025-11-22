import EcosystemRow from "@/components/v2/EcosystemRow";
import SectionCard from "@/components/v2/SectionCard";
import SparkBars from "@/components/v2/SparkBars";
import { v2ScoreEngine } from "@/lib/v2";

export const metadata = {
  title: "AIMS v2 · Leaderboard"
};

export default function V2LeaderboardPage() {
  const snapshots = v2ScoreEngine.getSnapshots();
  const ranked = [...snapshots].sort((a, b) => b.metrics.total - a.metrics.total);
  const transparencySpark = ranked.map((entry) => entry.metrics.transparencyCompliance.ratio * 100).slice(0, 12);
  const momentumSpark = ranked.map((entry) => entry.metrics.weightedDelta.value).slice(0, 12);
  const volatilityMix = ranked.reduce(
    (acc, entry) => {
      acc[entry.metrics.volatilityBucket] += 1;
      return acc;
    },
    { stable: 0, mixed: 0, volatile: 0 }
  );

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2</p>
        <div>
          <h1 className="text-3xl font-semibold text-slate-50">Leaderboard snapshot</h1>
          <p className="text-sm text-slate-400">
            Rankings are rendered exclusively from the v2 score engine snapshots with v2-only helpers for transparency,
            volatility, trend velocity, and ecosystem depth.
          </p>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Top transparency" subtitle="first 12" padded>
          <SparkBars values={transparencySpark} className="w-full" />
        </SectionCard>
        <SectionCard title="Momentum" subtitle="weighted delta" padded>
          <SparkBars values={momentumSpark} className="w-full" />
        </SectionCard>
        <SectionCard title="Coverage" subtitle={`${ranked.length} tracked`} padded>
          <p className="text-lg font-semibold text-slate-50">Volatility buckets</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-slate-300">
            {Object.entries(volatilityMix).map(([bucket, count]) => (
              <span
                key={bucket}
                className="rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-center capitalize"
              >
                {bucket} · {count}
              </span>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-surface/80 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">rankings</p>
            <h2 className="text-2xl font-semibold text-slate-50">Composite leaderboard</h2>
            <p className="text-sm text-slate-400">Sorted by v2 total score with velocity and ecosystem context.</p>
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{ranked.length} models</p>
        </div>
        <div className="mt-4 divide-y divide-slate-800/70">
          {ranked.map((entry, index) => (
            <EcosystemRow key={entry.model.slug} entry={entry} rank={index + 1} />
          ))}
        </div>
      </section>
    </main>
  );
}
