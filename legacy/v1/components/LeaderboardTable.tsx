import Link from "next/link";
import type { Model } from "@/types/model";
import { formatDelta, getModelDelta, getModelStatuses } from "@/lib/models";
import StatusPills from "@/components/StatusPills";

interface Props {
  models: Model[];
  windowDays: number;
}

const metricColumns = [
  { key: "performance", label: "Perf", accessor: (model: Model) => model.scores.performance },
  { key: "safety", label: "Safety", accessor: (model: Model) => model.scores.safety },
  { key: "cost", label: "Cost", accessor: (model: Model) => model.scores.cost },
  {
    key: "reliability",
    label: "Reliab.",
    accessor: (model: Model) => model.scores.reliability
  },
  {
    key: "transparency",
    label: "Transp.",
    accessor: (model: Model) => model.scores.transparency
  },
  { key: "ecosystem", label: "Ecosys.", accessor: (model: Model) => model.scores.ecosystem },
  { key: "adoption", label: "Adoption", accessor: (model: Model) => model.scores.adoption }
] as const;

export default function LeaderboardTable({ models, windowDays }: Props) {
  return (
    <div className="hidden md:block">
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface/80 shadow-xl">
        <table className="min-w-full text-sm">
          <thead className="text-[0.65rem] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">Model</th>
              <th className="px-4 py-3 text-center">Total</th>
              {metricColumns.map((column) => (
                <th key={column.key} className="px-3 py-3 text-center">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((model, index) => {
              const rank = index + 1;
              const statuses = getModelStatuses(model, rank);
              const delta = getModelDelta(model, windowDays);
              return (
                <tr
                  key={model.slug}
                  className="border-t border-slate-800/70 bg-background/40 hover:bg-background/70"
                >
                  <td className="px-4 py-4 text-sm text-slate-500">#{rank}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/models/${model.slug}`}
                      className="text-base font-semibold text-slate-50 hover:text-accent"
                    >
                      {model.name}
                    </Link>
                    <p className="text-xs text-slate-400">{model.vendor ?? model.provider}</p>
                    {model.modalities && model.modalities.length > 0 && (
                      <p className="text-[0.65rem] text-slate-500">
                        {model.modalities.join(" · ")}
                      </p>
                    )}
                    <StatusPills statuses={statuses} className="mt-2" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-xl font-semibold text-slate-50">
                      {model.total.toFixed(1)}
                    </div>
                    <div className={`text-[0.65rem] ${deltaColor(delta)}`}>
                      Δ {windowDays}d {formatDelta(delta)}
                    </div>
                  </td>
                  {metricColumns.map((column) => (
                    <td key={column.key} className="px-3 py-4 text-center font-semibold text-slate-100">
                      {column.accessor(model)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function deltaColor(delta: number) {
  if (delta > 0) return "text-positive";
  if (delta < 0) return "text-negative";
  return "text-slate-500";
}
