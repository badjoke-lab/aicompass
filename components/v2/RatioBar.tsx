interface RatioBarProps {
  label: string;
  ratio: number;
  emphasis?: boolean;
}

export function RatioBar({ label, ratio, emphasis = false }: RatioBarProps) {
  const safeRatio = Math.min(1, Math.max(0, ratio));
  const width = `${(safeRatio * 100).toFixed(0)}%`;
  return (
    <div className="space-y-1">
      <div className="h-2 w-full rounded-full bg-slate-800">
        <div className={`h-2 rounded-full ${emphasis ? "bg-accent" : "bg-slate-500"}`} style={{ width }} />
      </div>
      <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-wide text-slate-500">
        <span>{label}</span>
        <span className="font-semibold text-slate-300">{width}</span>
      </div>
    </div>
  );
}
