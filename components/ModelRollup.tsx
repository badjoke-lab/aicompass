import Link from "next/link";
import type { Model } from "@/types/model";
import { formatDelta, getSpikeDirection } from "@/lib/models";

interface Props {
  models: Model[];
  offset?: number;
}

export default function ModelRollup({ models, offset = 0 }: Props) {
  return (
    <div className="space-y-1 rounded-xl border border-slate-800 bg-surface/60 p-3 text-xs">
      {models.map((model, index) => (
        <div
          key={model.id}
          className="flex items-center justify-between gap-3 border-b border-slate-800/60 pb-2 last:border-0 last:pb-0"
        >
          <div className="flex flex-col">
            <Link href={`/model/${model.id}`} className="font-medium text-slate-100">
              {index + 1 + offset}. {model.name}
            </Link>
            <span className="text-[0.7rem] text-slate-500">{model.provider}</span>
          </div>
          <div className="text-right">
            <div className="text-[0.7rem] text-slate-400">Total</div>
            <div className="font-semibold text-slate-50">{model.total.toFixed(1)}</div>
            <div className={deltaColor(model)}>
              Δ {formatDelta(model.delta)}
            </div>
          </div>
          <StatusPill model={model} />
        </div>
      ))}
    </div>
  );
}

function deltaColor(model: Model) {
  if (model.delta > 0) return "text-[0.65rem] text-positive";
  if (model.delta < 0) return "text-[0.65rem] text-negative";
  return "text-[0.65rem] text-slate-400";
}

function StatusPill({ model }: { model: Model }) {
  const spike = getSpikeDirection(model.delta, model.waiting);
  if (!spike) return null;

  const baseClass =
    "rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide";

  if (spike === "waiting") {
    return (
      <span className={`${baseClass} bg-slate-600/30 text-slate-300`}>
        Waiting
      </span>
    );
  }

  const palette = spike === "up"
    ? { bg: "bg-positive/10", text: "text-positive", label: "Spike ↑" }
    : { bg: "bg-negative/10", text: "text-negative", label: "Spike ↓" };

  return (
    <span className={`${baseClass} ${palette.bg} ${palette.text}`}>
      {palette.label}
    </span>
  );
}
