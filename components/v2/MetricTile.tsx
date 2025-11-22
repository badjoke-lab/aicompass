interface MetricTileProps {
  label: string;
  value: string;
  helper?: string;
  tone?: "positive" | "negative" | "neutral";
}

export function MetricTile({ label, value, helper, tone = "neutral" }: MetricTileProps) {
  const toneClass = tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : "text-slate-100";
  return (
    <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold ${toneClass}`}>{value}</p>
      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}
