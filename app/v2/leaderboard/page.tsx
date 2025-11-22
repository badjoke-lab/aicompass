import { RatioBar } from "@/components/v2/RatioBar";
import { SectionCard } from "@/components/v2/SectionCard";
import { v2ScoreEngine } from "@/lib/v2";

const snapshots = v2ScoreEngine.getSnapshots();
const ranked = [...snapshots].sort((a, b) => b.metrics.total - a.metrics.total);

export const metadata = {
  title: "AIMS v2 · Leaderboard"
};

export default function V2LeaderboardPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2 internal</p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-50">Model leaderboard</h1>
          <p className="text-sm text-slate-400">
            Ranked snapshot using only the v2 score engine. Metrics come from the same volatility, transparency, velocity, and
            weighted delta calculations exposed in lib/v2.
          </p>
        </div>
      </header>

      <SectionCard title="Current ordering" description={`${ranked.length} tracked models`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Rank</th>
                <th className="px-3 py-3">Model</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Weighted Δ</th>
                <th className="px-3 py-3">Trend velocity</th>
                <th className="px-3 py-3">Transparency</th>
                <th className="px-3 py-3">Ecosystem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {ranked.map((entry, index) => (
                <LeaderboardRow key={entry.model.slug} entry={entry} rank={index + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function LeaderboardRow({ entry, rank }: { entry: (typeof ranked)[number]; rank: number }) {
  const { metrics } = entry;
  const transparencyPercent = Math.min(1, Math.max(0, metrics.transparencyCompliance.ratio));
  const ecosystemPercent = Math.min(1, metrics.ecosystemDepth.depth / 120);

  return (
    <tr className="bg-slate-950/30">
      <td className="px-3 py-3 font-semibold text-slate-400">#{rank}</td>
      <td className="px-3 py-3">
        <div className="font-semibold text-slate-50">{metrics.name}</div>
        <p className="text-xs text-slate-500">{metrics.vendor}</p>
      </td>
      <td className="px-3 py-3">
        <p className="text-lg font-semibold text-slate-50">{metrics.total.toFixed(1)}</p>
        <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">composite score</p>
      </td>
      <td className="px-3 py-3">
        <p className="font-mono text-slate-50">{metrics.weightedDelta.value.toFixed(2)}</p>
        <p className="text-[0.7rem] text-slate-500">raw Δ {metrics.weightedDelta.rawDelta.toFixed(1)}</p>
      </td>
      <td className="px-3 py-3">
        <p className={metrics.trendVelocity.velocity >= 0 ? "text-positive" : "text-negative"}>
          {metrics.trendVelocity.velocity.toFixed(2)} /wk
        </p>
        <p className="text-[0.7rem] text-slate-500">Δ {metrics.trendVelocity.delta.toFixed(1)}</p>
      </td>
      <td className="px-3 py-3">
        <RatioBar label="compliance" ratio={transparencyPercent} emphasis />
        <p className="text-[0.7rem] text-slate-500 mt-1">score {metrics.transparencyCompliance.transparencyScore.toFixed(1)}</p>
      </td>
      <td className="px-3 py-3">
        <RatioBar label="ecosystem" ratio={ecosystemPercent} />
        <p className="text-[0.7rem] text-slate-500 mt-1">signals {metrics.ecosystemDepth.evidenceSignals}</p>
      </td>
    </tr>
  );
}
