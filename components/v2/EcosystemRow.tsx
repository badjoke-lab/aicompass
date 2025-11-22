import Link from "next/link";
import type { V2ModelWithMetrics } from "@/lib/v2";
import RatioBar from "./RatioBar";

interface EcosystemRowProps {
  entry: V2ModelWithMetrics;
  rank?: number;
}

export default function EcosystemRow({ entry, rank }: EcosystemRowProps) {
  const { metrics } = entry;
  const transparencyPercent = Math.round(metrics.transparencyCompliance.ratio * 100);
  const ecosystemRatio = Math.min(1, metrics.ecosystemDepth.depth / 120);

  return (
    <div className="grid grid-cols-1 gap-3 border-b border-slate-800/70 py-4 text-sm last:border-none md:grid-cols-12 md:items-center">
      <div className="md:col-span-3">
        <div className="flex items-center gap-3">
          {rank !== undefined ? <span className="text-xs text-slate-500">#{rank}</span> : null}
          <div>
            <Link
              href={`/v2/models/${entry.model.slug}`}
              className="font-semibold text-slate-50 underline-offset-4 hover:text-accent hover:underline"
            >
              {metrics.name}
            </Link>
            <p className="text-xs uppercase tracking-wide text-slate-500">{metrics.vendor}</p>
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <p className="text-base font-semibold text-slate-50">{metrics.total.toFixed(1)}</p>
        <p className="text-xs text-slate-500">overall</p>
      </div>
      <div className="md:col-span-3">
        <p className="text-base font-semibold text-slate-50">
          {metrics.weightedDelta.value.toFixed(2)} · {metrics.trendVelocity.velocity.toFixed(2)}/wk
        </p>
        <p className="text-xs text-slate-500">weighted Δ · velocity</p>
      </div>
      <div className="md:col-span-2">
        <div className="font-semibold text-slate-50">{metrics.volatilityBucket}</div>
        <p className="text-xs text-slate-500">index {metrics.volatilityIndex.toFixed(2)}</p>
      </div>
      <div className="md:col-span-2 flex flex-col gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Transparency</p>
          <RatioBar ratio={metrics.transparencyCompliance.ratio} label={`${transparencyPercent}%`} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Ecosystem</p>
          <RatioBar ratio={ecosystemRatio} label={`${metrics.ecosystemDepth.evidenceSignals} signals`} />
        </div>
      </div>
    </div>
  );
}
