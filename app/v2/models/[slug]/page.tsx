import Link from "next/link";
import { v2ScoreEngine } from "@/lib/v2";
import type { V2ModelWithMetrics } from "@/lib/v2";

export const metadata = {
  title: "AIMS v2 · Prototype leaderboard"
};

export default function V2LeaderboardPage() {
  const snapshots = v2ScoreEngine.getSnapshots();
  const ranked = [...snapshots].sort((a, b) => b.metrics.total - a.metrics.total);
  const generatedAt = new Date().toISOString();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">alpha-only</p>
          <h1 className="text-2xl font-semibold text-slate-50">AIMS v2 leaderboard snapshot</h1>
        </div>
        <p className="text-sm text-slate-400">
          Rendering {ranked.length} tracked models from the v2 score engine. Metrics update with the
          data files and reuse all volatility, transparency, and delta logic from `/lib/v2`.
        </p>
        <p className="text-[0.75rem] text-slate-500">Generated at {generatedAt}</p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/30">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">Model</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Weighted Δ</th>
              <th className="px-4 py-3 text-left">Trend velocity</th>
              <th className="px-4 py-3 text-left">Volatility</th>
              <th className="px-4 py-3 text-left">Transparency</th>
              <th className="px-4 py-3 text-left">Ecosystem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60">
            {ranked.map((entry, index) => (
              <LeaderboardRow key={entry.model.slug} entry={entry} rank={index + 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, rank }: { entry: V2ModelWithMetrics; rank: number }) {
  const { metrics } = entry;
  const transparencyPercent = toPercent(metrics.transparencyCompliance.ratio);
  const ecosystemPercent = Math.min(120, metrics.ecosystemDepth.depth) / 120;

  return (
    <tr className="bg-gradient-to-r from-slate-950/20 to-slate-900/10">
      <td className="px-4 py-4 text-sm font-semibold text-slate-400">#{rank}</td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <Link
            href={`/v2/models/${entry.model.slug}`}
            className="font-semibold text-slate-100 underline-offset-4 hover:text-accent hover:underline"
          >
            {metrics.name}
          </Link>
          <span className="text-xs text-slate-500">{metrics.vendor}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-base font-semibold text-slate-100">{metrics.total.toFixed(1)}</div>
        <p className="text-xs text-slate-500">overall score</p>
      </td>
      <td className="px-4 py-4 text-sm">
        <div className="font-mono text-base text-slate-100">{metrics.weightedDelta.value.toFixed(2)}</div>
        <p className="text-xs text-slate-500">
          raw Δ {metrics.weightedDelta.rawDelta.toFixed(1)} · stability ×{metrics.weightedDelta.stabilityPenalty.toFixed(2)}
        </p>
      </td>
      <td className="px-4 py-4 text-sm">
        <div className={`font-semibold ${metrics.trendVelocity.velocity >= 0 ? "text-positive" : "text-negative"}`}>
          {metrics.trendVelocity.velocity.toFixed(2)} /wk
        </div>
        <p className="text-xs text-slate-500">
          window {metrics.trendVelocity.windowDays}d · Δ {metrics.trendVelocity.delta.toFixed(1)}
        </p>
      </td>
      <td className="px-4 py-4 text-sm">
        <p className="font-semibold capitalize text-slate-100">{metrics.volatilityBucket}</p>
        <p className="text-xs text-slate-500">index {metrics.volatilityIndex.toFixed(2)}</p>
      </td>
      <td className="px-4 py-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-100">{transparencyPercent.toFixed(0)}%</span>
          <RatioBar ratio={metrics.transparencyCompliance.ratio} label="compliance" />
        </div>
      </td>
      <td className="px-4 py-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-100">
            {metrics.ecosystemDepth.depth.toFixed(1)} pts · {metrics.ecosystemDepth.evidenceSignals} signals
          </span>
          <RatioBar ratio={ecosystemPercent} label="ecosystem" />
        </div>
      </td>
    </tr>
  );
}

function RatioBar({ ratio, label }: { ratio: number; label: string }) {
  const width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
  return (
    <div>
      <div className="h-2 w-full rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-accent" style={{ width }} />
      </div>
      <p className="mt-1 text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

function toPercent(value: number) {
  return Math.round(value * 100);
}
