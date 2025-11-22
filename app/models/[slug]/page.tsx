import { notFound } from "next/navigation";

import { MetricTile } from "@/components/v2/MetricTile";
import { RatioBar } from "@/components/v2/RatioBar";
import { SectionCard } from "@/components/v2/SectionCard";
import { V2ScoreEngine, getEvidence, getModels, getScores } from "@/lib/v2";

export const metadata = {
  title: "AIMS v2 · Model detail"
};

interface ModelDetailPageProps {
  params: { slug: string };
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  const models = getModels();
  const engine = new V2ScoreEngine(models);
  const snapshot = engine.getBySlug(params.slug);

  if (!snapshot) {
    return notFound();
  }

  const { model, metrics } = snapshot;
  const evidence = getEvidence(model.slug);
  const scores = getScores(model.slug);

  const evidenceBuckets: Array<{ key: keyof NonNullable<typeof evidence>; label: string; target: number }>
    = [
      { key: "pricing", label: "Pricing", target: 1 },
      { key: "safety", label: "Safety", target: 2 },
      { key: "benchmarks", label: "Benchmarks", target: 2 },
      { key: "technical", label: "Technical", target: 2 },
      { key: "items", label: "Curated items", target: 4 }
    ];

  const transparencyItems = [
    {
      label: "Transparency score",
      value: `${metrics.transparencyCompliance.transparencyScore.toFixed(0)}/100`,
      ratio: metrics.transparencyCompliance.transparencyScore / 100
    },
    {
      label: "Disclosure expectation",
      value: `${metrics.transparencyCompliance.disclosureScore.toFixed(0)}/6`,
      ratio: Math.min(1, metrics.transparencyCompliance.disclosureScore / 6)
    },
    {
      label: "Compliance ratio",
      value: `${(metrics.transparencyCompliance.ratio * 100).toFixed(0)}%`,
      ratio: metrics.transparencyCompliance.ratio,
      emphasis: true
    }
  ];

  const ecosystemStats = [
    {
      label: "Ecosystem depth",
      value: `${metrics.ecosystemDepth.depth.toFixed(1)} pts`,
      helper: `${metrics.ecosystemDepth.evidenceSignals} evidence signals`
    },
    {
      label: "Modality bonus",
      value: `+${metrics.ecosystemDepth.modalityBonus.toFixed(1)}`,
      helper: `${model.modalities?.length ?? (model.modality ? 1 : 0)} modalities`
    },
    {
      label: "Coverage bonus",
      value: `+${metrics.ecosystemDepth.coverageBonus.toFixed(1)}`,
      helper: "Evidence breadth boost"
    }
  ];

  const alertList: string[] = [];
  if (metrics.transparencyCompliance.ratio < 0.8) {
    alertList.push("Transparency below expectation — prioritize disclosure artifacts.");
  }
  if (metrics.trendVelocity.velocity < 0) {
    alertList.push("Negative velocity — recent performance is trending down.");
  }
  const emptyBuckets = evidenceBuckets.filter((bucket) => (evidence?.[bucket.key]?.length ?? 0) === 0);
  if (emptyBuckets.length > 0) {
    alertList.push(
      `Evidence gaps: ${emptyBuckets.map((bucket) => bucket.label.toLowerCase()).join(", ")}. Add source links to unblock scoring.`
    );
  }
  if (metrics.weightedDelta.value < 0) {
    alertList.push("Weighted delta is negative — stabilize volatility or adoption signals.");
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">aims-v2 internal</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-50">{model.name}</h1>
            <p className="text-sm text-slate-400">{model.vendor ?? model.provider}</p>
          </div>
          <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
            {model.modality ?? model.modalities?.join(", ") ?? "unknown"}
          </span>
        </div>
      </header>

      <SectionCard
        title="Momentum + transparency"
        description="Deterministic snapshot using aims-v2 weighted delta, velocity, and compliance ratios."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <MetricTile
            label="Weighted Δ"
            value={`${metrics.weightedDelta.value.toFixed(2)}`}
            helper={`Raw Δ ${metrics.weightedDelta.rawDelta.toFixed(2)} · stability ×${metrics.weightedDelta.stabilityPenalty.toFixed(2)}`}
            tone={metrics.weightedDelta.value >= 0 ? "positive" : "negative"}
          />
          <MetricTile
            label="Trend velocity"
            value={`${metrics.trendVelocity.velocity.toFixed(2)} /wk`}
            helper={`Window ${metrics.trendVelocity.windowDays}d · Δ ${metrics.trendVelocity.delta.toFixed(1)}`}
            tone={metrics.trendVelocity.velocity >= 0 ? "positive" : "negative"}
          />
          <MetricTile
            label="Transparency compliance"
            value={`${(metrics.transparencyCompliance.ratio * 100).toFixed(0)}%`}
            helper={`Score ${metrics.transparencyCompliance.transparencyScore} vs disclosure ${metrics.transparencyCompliance.disclosureScore}`}
            tone={metrics.transparencyCompliance.ratio >= 1 ? "positive" : "neutral"}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Evidence coverage"
        description="Buckets follow the v2 evidence schema with deterministic ordering."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {evidenceBuckets.map((bucket) => {
            const count = evidence?.[bucket.key]?.length ?? 0;
            const ratio = bucket.target > 0 ? Math.min(1, count / bucket.target) : 0;
            return (
              <div key={bucket.key} className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="font-semibold">{bucket.label}</span>
                  <span className="rounded-full border border-slate-800 px-2 py-0.5 text-xs text-slate-400">{count} / {bucket.target}</span>
                </div>
                <RatioBar label="coverage" ratio={ratio} emphasis={ratio >= 1} />
                <p className="text-xs text-slate-500">Targets set for alpha triage.</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Transparency ratios"
        description="Score vs disclosure expectation, rendered as deterministic bars."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {transparencyItems.map((item) => (
            <div key={item.label} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                <span className="text-xs text-slate-500">{item.value}</span>
              </div>
              <RatioBar label="ratio" ratio={item.ratio} emphasis={item.emphasis} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Ecosystem depth"
        description="Blend of adoption, modality bonuses, and evidence signals."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {ecosystemStats.map((stat) => (
            <div key={stat.label} className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{stat.label}</p>
              <p className="text-xl font-semibold text-slate-50">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.helper}</p>
            </div>
          ))}
          <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">Volatility + category mix</p>
            <p className="text-xl font-semibold text-slate-50">{metrics.volatilityBucket}</p>
            <p className="text-xs text-slate-500">Index {metrics.volatilityIndex.toFixed(2)}</p>
            {scores?.performance ? (
              <p className="text-xs text-slate-500">Performance score {scores.performance.toFixed(0)} /100</p>
            ) : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Backlog + risk alerts"
        description="Deterministic ordering; empty state means no active risks."
      >
        {alertList.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            No open alerts for this model.
          </p>
        ) : (
          <ul className="space-y-2">
            {alertList.map((alert) => (
              <li
                key={alert}
                className="rounded-2xl border border-amber-700/60 bg-amber-900/20 px-4 py-3 text-sm text-amber-100"
              >
                {alert}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <div className="h-10" aria-hidden />
    </div>
  );
}
