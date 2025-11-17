import type { ModelStatusCode } from "@/lib/models";

interface Props {
  statuses: ModelStatusCode[];
  size?: "sm" | "md";
  className?: string;
}

const SIZE_CLASS = {
  sm: "text-[0.6rem] px-2 py-0.5",
  md: "text-xs px-3 py-1"
};

const STATUS_META: Record<
  ModelStatusCode,
  { label: string; className: string }
> = {
  leader: {
    label: "Leader",
    className: "bg-accent/20 text-accent border border-accent/40"
  },
  spikeUp: {
    label: "Spike ↑",
    className: "bg-positive/10 text-positive border border-positive/30"
  },
  spikeDown: {
    label: "Spike ↓",
    className: "bg-negative/10 text-negative border border-negative/30"
  },
  waiting: {
    label: "Waiting",
    className: "bg-slate-700/40 text-slate-200 border border-slate-600"
  }
};

export default function StatusPills({
  statuses,
  size = "sm",
  className
}: Props) {
  if (!statuses.length) return null;

  const baseClass =
    "inline-flex items-center rounded-full font-semibold uppercase tracking-wide";

  return (
    <div className={`flex flex-wrap gap-1 ${className ?? ""}`}>
      {statuses.map((status) => (
        <span
          key={status}
          className={`${baseClass} ${SIZE_CLASS[size]} ${STATUS_META[status].className}`}
        >
          {STATUS_META[status].label}
        </span>
      ))}
    </div>
  );
}
