interface SparkBarsProps {
  values: number[];
  className?: string;
}

export default function SparkBars({ values, className }: SparkBarsProps) {
  if (!values.length) {
    return <div className={`h-10 w-full rounded-md bg-slate-900/40 ${className ?? ""}`} />;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const normalized = values.map((value) => (value - min) / span);

  return (
    <div className={`flex items-end gap-1 ${className ?? ""}`}>
      {normalized.map((ratio, index) => (
        <div
          key={index}
          className="flex-1 rounded-sm bg-gradient-to-t from-slate-800 to-accent"
          style={{ height: `${Math.max(0.1, ratio) * 48}px` }}
        />
      ))}
    </div>
  );
}
