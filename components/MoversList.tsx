import Link from "next/link";
import type { Model } from "@/types/model";
import { DELTA_WINDOW_DAYS, formatDelta, getModelStatuses } from "@/lib/models";
import StatusPills from "@/components/StatusPills";

interface Props {
  title: string;
  models: Model[];
  direction: "up" | "down";
}

export default function MoversList({ title, models, direction }: Props) {
  const emptyMessage =
    direction === "up" ? "No big movers up this window." : "No big drops this window.";

  return (
    <div className="rounded-2xl border border-slate-800 bg-surface/70 p-4">
      <h3
        className={`text-xs font-semibold uppercase tracking-wide ${
          direction === "up" ? "text-positive" : "text-negative"
        }`}
      >
        {title}
      </h3>
      <div className="mt-3 space-y-3 text-sm">
        {models.length === 0 && (
          <p className="text-[0.75rem] text-slate-500">{emptyMessage}</p>
        )}
        {models.map((model, index) => {
          const statuses = getModelStatuses(model);
          return (
            <div
              key={`${model.slug}-${index}`}
              className="rounded-xl border border-slate-800/60 bg-background/40 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Link href={`/models/${model.slug}`} className="font-semibold text-slate-50">
                    {model.name}
                  </Link>
                  <p className="text-xs text-slate-400">{model.provider}</p>
                </div>
                <div className={`text-sm font-semibold ${direction === "up" ? "text-positive" : "text-negative"}`}>
                  {formatDelta(model.delta)}
                </div>
              </div>
              <StatusPills statuses={statuses} className="mt-2" />
              <p className="text-[0.65rem] text-slate-500">
                Δ {DELTA_WINDOW_DAYS}d change tracked via public checkpoints.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
