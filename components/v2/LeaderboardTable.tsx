const rows = [
  { rank: 1, model: "Atlas 3", score: "98.4", delta: "+1.2", trend: "▲ Stable" },
  { rank: 2, model: "Nebula XL", score: "95.1", delta: "-0.3", trend: "▼ Cooling" },
  { rank: 3, model: "Quanta Mini", score: "93.7", delta: "+0.6", trend: "▲ Warming" },
  { rank: 4, model: "Vector Prime", score: "91.0", delta: "0.0", trend: "→ Flat" },
  { rank: 5, model: "Helix Edge", score: "89.5", delta: "-1.1", trend: "▼ Drifting" }
];

export default function LeaderboardTable() {
  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface/80 p-4 shadow-inner">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Rank</th>
            <th className="px-4 py-3 font-semibold">Model</th>
            <th className="px-4 py-3 font-semibold">Score</th>
            <th className="px-4 py-3 font-semibold">Δ</th>
            <th className="px-4 py-3 font-semibold">Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {rows.map((row) => (
            <tr key={row.rank} className="bg-slate-950/40">
              <td className="px-4 py-3 font-semibold text-slate-400">#{row.rank}</td>
              <td className="px-4 py-3 font-semibold">{row.model}</td>
              <td className="px-4 py-3 font-mono">{row.score}</td>
              <td className="px-4 py-3 font-mono">{row.delta}</td>
              <td className="px-4 py-3">{row.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
