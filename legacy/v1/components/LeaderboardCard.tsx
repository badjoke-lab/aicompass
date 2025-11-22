import Link from "next/link";
import type { Model } from "@/types/model";
import { DELTA_WINDOW_DAYS, formatDelta, getModelDelta, getModelStatuses } from "@/lib/models";
import StatusPills from "@/components/StatusPills";

interface Props {
  model: Model;
  rank: number;
}

const mobileMetrics = [
  { key: "performance", label: "Perf", accessor: (model: Model) => model.scores.performance },
  { key: "safety", label: "Safety", accessor: (model: Model) => model.scores.safety },
  { key: "reliability", label: "Reliab.", accessor: (model: Model) => model.scores.reliability },
  { key: "cost", label: "Cost", accessor: (model: Model) => model.scores.cost }
] as const;

export default function LeaderboardCard({ model, rank }: Props) {
  const statuses = getModelStatuses(model, rank);
  const delta = getModelDelta(model);
  return (
    <Link
      href={`/models/${model.slug}`}
      className="rounded-2xl border border-slate-800 bg-surface/70 p-4 shadow hover:border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">#{rank}</p>
          <p className="text-lg font-semibold text-slate-50">{model.name}</p>
          <p className="text-xs text-slate-400">{model.vendor ?? model.provider}</p>
        </div>
        <div className="text-right">
          <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">Total</p>
          <p className="text-2xl font-semibold text-slate-50">
            {model.total.toFixed(1)}
          </p>
          <p className={`text-[0.65rem] ${deltaColor(delta)}`}>
            Δ {DELTA_WINDOW_DAYS}d {formatDelta(delta)}
          </p>
        </div>
      </div>
      <StatusPills statuses={statuses} className="mt-2" />
      <div className="mt-3 grid grid-cols-2 gap-2 text-[0.75rem] text-slate-300">
        {mobileMetrics.map((metric) => (
          <div
            key={metric.key}
            className="flex items-center justify-between rounded-lg bg-slate-900/40 px-2 py-1"
          >
            <span className="text-slate-400">{metric.label}</span>
            <span className="font-semibold text-slate-100">
              {metric.accessor(model)}
            </span>
          </div>
        ))}
      </div>
      {model.modalities && model.modalities.length > 0 && (
        <p className="mt-3 text-[0.65rem] text-slate-500">
          Modalities: {model.modalities.join(", ")}
        </p>
      )}
    </Link>
  );
}

function deltaColor(delta: number) {
  if (delta > 0) return "text-positive";
  if (delta < 0) return "text-negative";
  return "text-slate-500";
}
