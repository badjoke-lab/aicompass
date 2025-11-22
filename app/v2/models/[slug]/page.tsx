import Link from "next/link";
import { notFound } from "next/navigation";
import RatioBar from "@/components/v2/RatioBar";
import SectionCard from "@/components/v2/SectionCard";
import SparkBars from "@/components/v2/SparkBars";
import { v2ScoreEngine } from "@/lib/v2";

export const metadata = {
  title: "AIMS v2 · Model profile"
};

export default function ModelProfilePage({ params }: { params: { slug: string } }) {
  const snapshot = v2ScoreEngine.getBySlug(params.slug);
  if (!snapshot) {
    return notFound();
  }

  const { model, metrics } = snapshot;
  const historyTotals = (model.history ?? []).map((entry) => entry.total);

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <Link href="/v2/leaderboard" className="text-xs uppercase tracking-[0.3em] text-slate-500 underline-offset-4 hover:underline">
          aims v2
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-slate-50">{metrics.name}</h1>
          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs uppercase tracking-wide text-slate-400">
            {metrics.vendor}
          </span>
        </div>
        <p className="text-sm text-slate-400">Profile sourced entirely from the v2 score engine snapshot.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Total" subtitle="Composite" padded>
          <p className="text-3xl font-semibold text-slate-50">{metrics.total.toFixed(1)}</p>
          <p className="text-xs text-slate-500">Volatility {metrics.volatilityBucket} · index {metrics.volatilityIndex.toFixed(2)}</p>
        </SectionCard>
        <SectionCard title="Momentum" subtitle="Weighted delta" padded>
          <p className="text-3xl font-semibold text-slate-50">{metrics.weightedDelta.value.toFixed(2)}</p>
          <p className="text-xs text-slate-500">Raw Δ {metrics.weightedDelta.rawDelta.toFixed(1)} · stability ×{metrics.weightedDelta.stabilityPenalty.toFixed(2)}</p>
        </SectionCard>
        <SectionCard title="Trend velocity" subtitle={`${metrics.trendVelocity.windowDays}d window`} padded>
          <p className="text-3xl font-semibold text-slate-50">{metrics.trendVelocity.velocity.toFixed(2)} / wk</p>
          <p className="text-xs text-slate-500">Δ{metrics.trendVelocity.delta.toFixed(2)} over {metrics.trendVelocity.sampleCount} pts</p>
        </SectionCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Transparency" subtitle="Compliance vs disclosure" padded>
          <div className="space-y-2">
            <RatioBar ratio={metrics.transparencyCompliance.ratio} label={`Score ${metrics.transparencyCompliance.transparencyScore}`} />
            <p className="text-xs text-slate-500">Disclosure expectation {metrics.transparencyCompliance.disclosureScore}</p>
          </div>
        </SectionCard>
        <SectionCard title="Ecosystem" subtitle="Depth & signals" padded>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-slate-50">{metrics.ecosystemDepth.depth.toFixed(1)} pts</p>
            <p className="text-xs text-slate-500">{metrics.ecosystemDepth.evidenceSignals} evidence signals · modality bonus {metrics.ecosystemDepth.modalityBonus.toFixed(1)}</p>
            <RatioBar ratio={Math.min(1, metrics.ecosystemDepth.depth / 120)} label="Scaled to 120" />
          </div>
        </SectionCard>
      </section>

      <SectionCard title="History" subtitle="Last scores" padded>
        <SparkBars values={historyTotals.slice(-24)} className="w-full" />
        <p className="mt-2 text-xs text-slate-500">{historyTotals.length} total entries</p>
      </SectionCard>
    </main>
  );
}
