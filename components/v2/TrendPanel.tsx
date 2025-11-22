import Link from "next/link";
import SparkBars from "./SparkBars";
import type { TrendLeader } from "@/lib/v2";

interface TrendPanelProps {
  title: string;
  description: string;
  data: TrendLeader[];
}

export default function TrendPanel({ title, description, data }: TrendPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-surface/80 p-5 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">velocity</p>
          <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <span className="text-xs uppercase tracking-wide text-slate-500">{data.length} models</span>
      </div>

      <div className="mt-4 divide-y divide-slate-800/70">
        {data.map((entry) => (
          <TrendRow key={entry.slug} entry={entry} />
        ))}
        {data.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">No entries in this band.</p>
        ) : null}
      </div>
    </section>
  );
}

function TrendRow({ entry }: { entry: TrendLeader }) {
  const directionClass = entry.velocity >= 0 ? "text-positive" : "text-negative";
  const bars = (entry.history ?? []).map((point) => point.total).slice(-12);

  return (
    <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
      <div>
        <Link
          href={`/v2/models/${entry.slug}`}
          className="font-semibold text-slate-50 underline-offset-4 hover:text-accent hover:underline"
        >
          {entry.name}
        </Link>
        <p className="text-xs uppercase tracking-wide text-slate-500">{entry.vendor}</p>
        <p className={`text-sm font-semibold ${directionClass}`}>
          {entry.velocity.toFixed(2)} / wk · Δ{entry.delta.toFixed(1)}
        </p>
        <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">Volatility {entry.volatilityBucket}</p>
      </div>
      <SparkBars values={bars} className="w-full md:max-w-sm" />
    </div>
  );
}
