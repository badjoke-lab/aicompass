import type { ReactNode } from "react";
import Link from "next/link";
import type { V2ModelWithMetrics } from "@/lib/v2";

interface Props {
  entries: V2ModelWithMetrics[];
}

export default function V2LeaderboardTable({ entries }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-surface/60 shadow-lg">
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
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
            {entries.map((entry, index) => (
              <LeaderboardRow key={entry.model.slug} entry={entry} rank={index + 1} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {entries.map((entry, index) => (
          <LeaderboardCard key={entry.model.slug} entry={entry} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, rank }: { entry: V2ModelWithMetrics; rank: number }) {
  const { metrics } = entry;
  const transparencyPercent = toPercent(metrics.transparencyCompliance.ratio);
  const ecosystemPercent = Math.min(120, metrics.ecosystemDepth.depth) / 120;

  return (
    <tr className="bg-gradient-to-r from-slate-950/30 to-slate-900/20">
      <td className="px-4 py-4 text-sm font-semibold text-slate-400">#{rank}</td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <Link
            href={`/models/${entry.model.slug}`}
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
          Δ {metrics.weightedDelta.rawDelta.toFixed(1)} · stability ×{metrics.weightedDelta.stabilityPenalty.toFixed(2)}
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

function LeaderboardCard({ entry, rank }: { entry: V2ModelWithMetrics; rank: number }) {
  const { metrics } = entry;
  const transparencyPercent = toPercent(metrics.transparencyCompliance.ratio);
  const ecosystemPercent = Math.min(120, metrics.ecosystemDepth.depth) / 120;

  return (
    <div className="rounded-2xl border border-slate-800 bg-surface/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Rank #{rank}</p>
          <Link
            href={`/models/${entry.model.slug}`}
            className="text-lg font-semibold text-slate-100 underline-offset-4 hover:text-accent hover:underline"
          >
            {metrics.name}
          </Link>
          <p className="text-xs text-slate-500">{metrics.vendor}</p>
        </div>
        <div className="text-right">
          <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">Total</p>
          <p className="text-2xl font-semibold text-slate-50">{metrics.total.toFixed(1)}</p>
          <p className="text-[0.7rem] text-slate-500">Weighted Δ {metrics.weightedDelta.value.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <MetricItem label="Trend velocity" value={`${metrics.trendVelocity.velocity.toFixed(2)} /wk`}>
          <span className="text-xs text-slate-500">Δ {metrics.trendVelocity.delta.toFixed(1)}</span>
        </MetricItem>
        <MetricItem label="Volatility" value={metrics.volatilityBucket}>
          <span className="text-xs text-slate-500">index {metrics.volatilityIndex.toFixed(2)}</span>
        </MetricItem>
        <MetricItem label="Transparency" value={`${transparencyPercent.toFixed(0)}%`}>
          <RatioBar ratio={metrics.transparencyCompliance.ratio} label="compliance" />
        </MetricItem>
        <MetricItem label="Ecosystem" value={`${metrics.ecosystemDepth.depth.toFixed(1)} pts`}>
          <RatioBar ratio={ecosystemPercent} label="ecosystem" />
        </MetricItem>
      </div>
    </div>
  );
}

function MetricItem({
  label,
  value,
  children
}: {
  label: string;
  value: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-background/40 px-3 py-2">
      <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="font-semibold text-slate-100">{value}</p>
      {children}
    </div>
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
