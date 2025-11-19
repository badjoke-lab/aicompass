import type { Model } from "@/types/model";

interface Props {
  history?: Model["history"];
  chartId?: string;
}

export default function HistorySparkline({ history, chartId }: Props) {
  if (!history || history.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        Trend data will appear when at least two checkpoints are published.
      </p>
    );
  }

  const normalized = history as NonNullable<Model["history"]>;
  const gradientId = chartId ? `sparkGradient-${chartId}` : "sparkGradient";
  const points = buildPoints(normalized);
  const first = normalized[0];
  const latest = normalized[normalized.length - 1];

  return (
    <div>
      <svg viewBox="0 0 100 40" className="h-32 w-full">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={points.area}
          fill={`url(#${gradientId})`}
          className="opacity-40"
        />
        <path
          d={points.line}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-3 text-[0.7rem] text-slate-400">
        <div>
          <p className="uppercase tracking-wide text-[0.6rem] text-slate-500">
            Start
          </p>
          <p className="text-slate-200">
            {formatDate(first.date)} · {first.total.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="uppercase tracking-wide text-[0.6rem] text-slate-500">
            Latest
          </p>
          <p className="text-slate-200">
            {formatDate(latest.date)} · {latest.total.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}

function buildPoints(history: NonNullable<Model["history"]>) {
  const totals = history.map((point) => point.total);
  const min = Math.min(...totals);
  const max = Math.max(...totals);
  const range = max - min || 1;
  const segments = Math.max(1, history.length - 1);

  const coords = history.map((point, index) => {
    const x = (index / segments) * 100;
    const y = 40 - ((point.total - min) / range) * 40;
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  });

  const line = coords.join(" ");
  const area = `${line} L100,40 L0,40 Z`;

  return { line, area };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit"
  }).format(new Date(date));
}
