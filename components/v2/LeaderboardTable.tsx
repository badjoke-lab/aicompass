import type { V2ModelWithMetrics } from "@/lib/v2";

interface LeaderboardTableProps {
  entries: V2ModelWithMetrics[];
  windowLabel?: string;
}

export default function LeaderboardTable({ entries, windowLabel }: LeaderboardTableProps) {
  const rows = [...entries].sort((a, b) => b.metrics.total - a.metrics.total);

  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface/80 p-4 shadow-inner">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Rank</th>
            <th className="px-4 py-3 font-semibold">Model</th>
            <th className="px-4 py-3 font-semibold">Score</th>
            <th className="px-4 py-3 font-semibold">Weighted Δ{windowLabel ? ` ${windowLabel}` : ""}</th>
            <th className="px-4 py-3 font-semibold">Velocity (/wk)</th>
            <th className="px-4 py-3 font-semibold">Volatility</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {rows.map((row, index) => (
            <tr key={row.metrics.slug} className="bg-slate-950/40">
              <td className="px-4 py-3 font-semibold text-slate-400">#{index + 1}</td>
              <td className="px-4 py-3 font-semibold">
                <div>{row.metrics.name}</div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{row.metrics.vendor}</p>
              </td>
              <td className="px-4 py-3 font-mono">{row.metrics.total.toFixed(1)}</td>
              <td className="px-4 py-3 font-mono">
                {formatDelta(row.metrics.weightedDelta.value)}
                <span className="ml-2 text-[0.7rem] text-slate-500">
                  raw {formatDelta(row.metrics.weightedDelta.rawDelta)}
                </span>
              </td>
              <td className="px-4 py-3 font-mono">{row.metrics.trendVelocity.velocity.toFixed(2)}</td>
              <td className="px-4 py-3 capitalize">{row.metrics.volatilityBucket}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function formatDelta(value: number) {
  if (value > 0) return `+${value.toFixed(2)}`;
  if (value < 0) return value.toFixed(2);
  return "0.00";
}
