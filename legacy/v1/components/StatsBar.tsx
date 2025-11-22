import type { Model } from "@/types/model";

interface Stats {
  tracked: number;
  waiting: number;
  active: number;
  avgTotal: number;
  leader: Model | null;
  coveragePercent: number;
  lastUpdated: Date | null;
}

interface Props {
  stats: Stats;
  windowDays: number;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric"
});

export default function StatsBar({ stats, windowDays }: Props) {
  const cards = [
    {
      label: "Tracked models",
      value: stats.tracked.toString(),
      helper: `${stats.coveragePercent}% ready · ${stats.waiting} waiting`
    },
    {
      label: "Average total",
      value: stats.avgTotal.toFixed(1),
      helper: stats.leader
        ? `Leader: ${stats.leader.name} (${stats.leader.total.toFixed(1)})`
        : "Leader: TBD"
    },
    {
      label: "Last update",
      value: formatDate(stats.lastUpdated) ?? "—",
      helper: `Δ window: ${windowDays} days`
    }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-800 bg-surface/80 px-4 py-3"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
            {card.label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">{card.value}</p>
          <p className="text-[0.7rem] text-slate-500">{card.helper}</p>
        </div>
      ))}
    </div>
  );
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return dateFormatter.format(date);
}
