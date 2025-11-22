interface SparkBarsProps {
  bars: number[];
  max: number;
  label?: string;
}

export function SparkBars({ bars, max, label }: SparkBarsProps) {
  const safeMax = Math.max(1, max);
  const normalized = bars.slice(0, 3).map((value) => Math.max(0, value) / safeMax);
  const barWidth = 12;
  const gap = 4;
  const height = 18;
  const width = normalized.length * barWidth + Math.max(0, normalized.length - 1) * gap;

  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="text-slate-500">
        {normalized.map((ratio, index) => {
          const barHeight = Math.max(2, ratio * height);
          const x = index * (barWidth + gap);
          const y = height - barHeight;
          return <rect key={index} x={x} y={y} width={barWidth} height={barHeight} className="fill-emerald-400/80" rx={2} />;
        })}
      </svg>
      {label ? <span className="text-[0.7rem] text-slate-500">{label}</span> : null}
    </div>
  );
}
