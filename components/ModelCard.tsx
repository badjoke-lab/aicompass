import Link from "next/link";

export interface Model {
  id: string;
  name: string;
  provider: string;
  total: number;
  delta: number;
  scores: {
    performance: number;
    safety: number;
    cost: number;
    transparency: number;
  };
  categories?: {
    text?: number | null;
    coding?: number | null;
    vision?: number | null;
    image?: number | null;
    video?: number | null;
  };
  waiting?: boolean;
}

function formatDelta(delta: number): string {
  if (delta === 0) return "±0.0";
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`;
}

function getSpike(delta: number, waiting?: boolean): "up" | "down" | "waiting" | null {
  if (waiting) return "waiting";
  if (delta >= 3) return "up";
  if (delta <= -3) return "down";
  return null;
}

export default function ModelCard({ model }: { model: Model }) {
  const spike = getSpike(model.delta, model.waiting);

  return (
    <Link
      href={`/model/${model.id}`}
      className="flex flex-col rounded-xl border border-slate-800 bg-surface/60 p-4 shadow-sm transition hover:border-accent hover:bg-surface"
    >
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-50">
            {model.name}
          </div>
          <div className="text-xs text-slate-400">{model.provider}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Total
          </div>
          <div className="text-xl font-semibold text-slate-50">
            {model.total.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Δ 30d</span>
          <span
            className={
              model.delta > 0
                ? "font-medium text-positive"
                : model.delta < 0
                  ? "font-medium text-negative"
                  : "font-medium text-slate-300"
            }
          >
            {formatDelta(model.delta)}
          </span>
        </div>

        {spike && (
          <span
            className={
              spike === "up"
                ? "rounded-full bg-positive/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-positive"
                : spike === "down"
                  ? "rounded-full bg-negative/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-negative"
                  : "rounded-full bg-slate-600/30 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-300"
            }
          >
            {spike === "up"
              ? "Spike ↑"
              : spike === "down"
                ? "Spike ↓"
                : "Waiting"}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[0.7rem] text-slate-300">
        <div className="flex items-center justify-between rounded-md bg-slate-900/50 px-2 py-1">
          <span className="text-slate-400">Perf</span>
          <span className="font-semibold">{model.scores.performance}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-slate-900/50 px-2 py-1">
          <span className="text-slate-400">Safety</span>
          <span className="font-semibold">{model.scores.safety}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-slate-900/50 px-2 py-1">
          <span className="text-slate-400">Cost</span>
          <span className="font-semibold">{model.scores.cost}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-slate-900/50 px-2 py-1">
          <span className="text-slate-400">Transp.</span>
          <span className="font-semibold">{model.scores.transparency}</span>
        </div>
      </div>
    </Link>
  );
}
