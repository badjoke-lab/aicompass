import LeaderboardTable from "@/components/v2/LeaderboardTable";
import { MetricTile } from "@/components/v2/MetricTile";
import { RatioBar } from "@/components/v2/RatioBar";
import { SectionCard } from "@/components/v2/SectionCard";
import {
  V2_DELTA_WINDOW_DAYS,
  getInternalDashboardData,
  v2ScoreEngine
} from "@/lib/v2";

const dashboard = getInternalDashboardData();
const snapshots = v2ScoreEngine.getSnapshots();

export default function ScoresPage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2</p>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">AI Model Scoreboard</h1>
        <p className="max-w-3xl text-sm text-slate-400">
          Unified v2-only surface built on deterministic snapshot data, weighted delta signals, and transparency ratios.
          All computations are local and render directly from v2 helpers.
        </p>
      </section>

      <SectionCard
        title="AIMS v2 status"
        description={`Δ window ${V2_DELTA_WINDOW_DAYS} days across ${dashboard.summary.tracked} tracked models`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            label="Global health"
            value={`${dashboard.summary.globalHealthScore}`}
            helper="Composite of completeness, transparency, stability, and momentum"
          />
          <MetricTile
            label="Active vs waiting"
            value={`${dashboard.summary.active}`}
            helper={`Waiting ${dashboard.summary.waiting} · coverage ${dashboard.summary.coveragePercent}%`}
          />
          <MetricTile
            label="Median transparency"
            value={`${dashboard.summary.medianTransparency.toFixed(1)}%`}
            helper="Ratio of transparency vs disclosure expectation"
          />
          <MetricTile
            label="Evidence signals"
            value={`${dashboard.evidence.coverage.reduce((sum, entry) => sum + entry.count, 0).toFixed(1)}`}
            helper="Total average signals across buckets"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <RatioBar label="Metadata completeness" ratio={dashboard.summary.metadataAverage / 100} />
          <RatioBar label="Evidence completeness" ratio={dashboard.summary.evidenceAverage / 100} />
        </div>
      </SectionCard>

      <SectionCard
        title="Live leaderboard"
        description="Ranks pull directly from v2 metrics, weighted delta, and velocity snapshots"
      >
        <LeaderboardTable entries={snapshots} windowLabel={`Δ${V2_DELTA_WINDOW_DAYS}d`} />
      </SectionCard>

      <SectionCard
        title="Trend leaders"
        description="Models with the strongest positive velocity are highlighted below"
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {dashboard.trendLeaders.map((leader) => (
            <div key={leader.slug} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{leader.vendor}</p>
              <p className="text-lg font-semibold text-slate-50">{leader.name}</p>
              <p className="text-sm text-slate-400">Velocity {leader.velocity.toFixed(2)} /wk</p>
              <p className="text-xs text-slate-500">Δ {leader.delta.toFixed(2)} across {leader.history?.length ?? 0} points</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
