import Link from "next/link";
import { notFound } from "next/navigation";
import { RatioBar } from "@/components/v2/RatioBar";
import { SectionCard } from "@/components/v2/SectionCard";
import { getInternalDashboardData, v2ScoreEngine } from "@/lib/v2";

export const metadata = {
  title: "AIMS v2 · Model detail"
};

const dashboard = getInternalDashboardData();

export default function V2ModelDetailPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const snapshot = v2ScoreEngine.getBySlug(slug);
  if (!snapshot) {
    notFound();
  }
  const healthRow = dashboard.modelHealth.find((entry) => entry.slug === slug);
  const ordered = [...dashboard.metrics].sort((a, b) => b.metrics.total - a.metrics.total);
  const rank = ordered.findIndex((entry) => entry.model.slug === slug) + 1;

  const metadataRatio = healthRow?.metadata.ratio ?? 0;
  const evidenceRatio = healthRow?.evidence.ratio ?? 0;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2 internal</p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-50">{snapshot.metrics.name}</h1>
          <p className="text-sm text-slate-400">{snapshot.metrics.vendor}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="rounded-full border border-slate-800 px-3 py-1">Rank #{rank || "-"}</span>
          <span className="rounded-full border border-slate-800 px-3 py-1">Volatility {snapshot.metrics.volatilityBucket}</span>
          <span className="rounded-full border border-slate-800 px-3 py-1">History samples {snapshot.model.history?.length ?? 0}</span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Composite" value={snapshot.metrics.total.toFixed(1)} helper="v2 total score" />
        <MetricCard
          label="Weighted Δ"
          value={snapshot.metrics.weightedDelta.value.toFixed(2)}
          helper={`raw Δ ${snapshot.metrics.weightedDelta.rawDelta.toFixed(1)}`}
        />
        <MetricCard
          label="Trend velocity"
          value={`${snapshot.metrics.trendVelocity.velocity.toFixed(2)} /wk`}
          helper={`Δ ${snapshot.metrics.trendVelocity.delta.toFixed(1)} window ${snapshot.metrics.trendVelocity.windowDays}d`}
        />
        <MetricCard
          label="Transparency"
          value={`${(snapshot.metrics.transparencyCompliance.ratio * 100).toFixed(1)}%`}
          helper={`score ${snapshot.metrics.transparencyCompliance.transparencyScore.toFixed(1)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Health composition" description="Ratios pulled directly from v2 dashboard calculations">
          <div className="space-y-3">
            <RatioBar label="Metadata" ratio={metadataRatio} />
            <RatioBar label="Evidence" ratio={evidenceRatio} />
            <RatioBar label="Transparency" ratio={snapshot.metrics.transparencyCompliance.ratio} emphasis />
            <RatioBar
              label="Stability (inverse volatility)"
              ratio={Math.max(0, 1 - snapshot.metrics.volatilityIndex / 6)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Ecosystem depth" description="Derived from modalities, adoption, and evidence signals">
          <div className="space-y-3">
            <p className="text-3xl font-semibold text-slate-50">{snapshot.metrics.ecosystemDepth.depth.toFixed(1)}</p>
            <p className="text-sm text-slate-400">
              {snapshot.metrics.ecosystemDepth.evidenceSignals} signals · modality bonus {snapshot.metrics.ecosystemDepth.modalityBonus.toFixed(1)} ·
              coverage bonus {snapshot.metrics.ecosystemDepth.coverageBonus.toFixed(1)}
            </p>
            <RatioBar label="Depth vs cap" ratio={Math.min(1, snapshot.metrics.ecosystemDepth.depth / 120)} />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Metadata fields" description="Fields counted toward completeness ratio">
          {healthRow ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {healthRow.metadata.present.map((label) => (
                <Pill key={label} label={label} tone="positive" />
              ))}
              {healthRow.metadata.missing.map((label) => (
                <Pill key={label} label={label} tone="neutral" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No metadata breakdown available.</p>
          )}
        </SectionCard>

        <SectionCard title="Evidence buckets" description="Signals grouped by pricing, benchmarks, safety, technical, items">
          {healthRow ? (
            <div className="space-y-2">
              {healthRow.evidence.buckets.map((bucket) => (
                <div key={bucket.key} className="flex items-center justify-between rounded-xl border border-slate-800 px-3 py-2">
                  <div>
                    <p className="font-semibold text-slate-100">{bucket.label}</p>
                    <p className="text-[0.7rem] text-slate-500">{bucket.count} signals</p>
                  </div>
                  <p className="text-sm font-mono text-slate-50">{(bucket.completeness * 100).toFixed(1)}%</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No evidence breakdown available.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Return to leaderboard" description="Browse all v2-ranked models">
        <Link href="/v2/leaderboard" className="text-sm font-semibold text-accent underline-offset-4 hover:underline">
          View leaderboard
        </Link>
      </SectionCard>
    </div>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-50">{value}</p>
      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

function Pill({ label, tone }: { label: string; tone: "positive" | "neutral" }) {
  const toneClass = tone === "positive" ? "border-emerald-500/60 text-emerald-200" : "border-slate-700 text-slate-300";
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${toneClass}`}>{label}</span>;
}
