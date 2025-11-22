import Link from "next/link";
import { notFound } from "next/navigation";
import { MetricTile } from "@/components/v2/MetricTile";
import { RatioBar } from "@/components/v2/RatioBar";
import { SectionCard } from "@/components/v2/SectionCard";
import {
  V2_DELTA_WINDOW_DAYS,
  getInternalDashboardData,
  getModelBySlug,
  getModels,
  v2ScoreEngine
} from "@/lib/v2";

const models = getModels();
const dashboard = getInternalDashboardData();

interface Params {
  slug: string;
}

export async function generateStaticParams() {
  return models.map((model) => ({ slug: model.slug }));
}

export default function ModelPage({ params }: { params: Params }) {
  const model = getModelBySlug(params.slug);
  const metrics = v2ScoreEngine.getBySlug(params.slug);
  const health = dashboard.modelHealth.find((entry) => entry.slug === params.slug);

  if (!model || !metrics || !health) {
    notFound();
  }

  const metadataRatio = health.metadata.ratio;
  const evidenceRatio = health.evidence.ratio;
  const transparencyRatio = metrics.metrics.transparencyCompliance.ratio;

  return (
    <div className="space-y-6">
      <Link href="/" className="text-xs text-accent">
        ← Back to leaderboard
      </Link>

      <SectionCard
        title={model.name}
        description={`${model.vendor ?? model.provider} · Δ window ${V2_DELTA_WINDOW_DAYS} days`}
        action={<span className="text-xs uppercase tracking-wide text-slate-500">aims v2</span>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Total score" value={model.total.toFixed(1)} helper="Raw v2 total" />
          <MetricTile
            label="Weighted Δ"
            value={formatDelta(metrics.metrics.weightedDelta.value)}
            helper="Momentum + stability adjusted"
            tone={metrics.metrics.weightedDelta.value >= 0 ? "positive" : "negative"}
          />
          <MetricTile
            label="Velocity (/wk)"
            value={metrics.metrics.trendVelocity.velocity.toFixed(2)}
            helper={`Δ ${metrics.metrics.trendVelocity.delta.toFixed(2)} over ${metrics.metrics.trendVelocity.sampleCount} points`}
            tone={metrics.metrics.trendVelocity.velocity >= 0 ? "positive" : "negative"}
          />
          <MetricTile
            label="Volatility"
            value={metrics.metrics.volatilityBucket}
            helper={`Index ${metrics.metrics.volatilityIndex.toFixed(2)}`}
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Completeness"
          description="Metadata and evidence ratios feed the composite health score"
        >
          <RatioBar label="Metadata" ratio={metadataRatio} emphasis={metadataRatio < 0.8} />
          <RatioBar label="Evidence" ratio={evidenceRatio} emphasis={evidenceRatio < 0.7} />
          <RatioBar label="Transparency" ratio={transparencyRatio} emphasis={transparencyRatio < 0.75} />
        </SectionCard>

        <SectionCard title="Weighted delta details" description="Stability, adoption, and performance drivers">
          <div className="grid gap-3 sm:grid-cols-2">
          <MetricTile
            label="Raw Δ"
            value={formatDelta(metrics.metrics.weightedDelta.rawDelta)}
            helper={`Unweighted ${V2_DELTA_WINDOW_DAYS}-day delta`}
            tone={metrics.metrics.weightedDelta.rawDelta >= 0 ? "positive" : "negative"}
          />
            <MetricTile
              label="Momentum boost"
              value={metrics.metrics.weightedDelta.momentumBoost.toFixed(2)}
              helper="Velocity contribution"
              tone={metrics.metrics.weightedDelta.momentumBoost >= 0 ? "positive" : "negative"}
            />
            <MetricTile
              label="Stability penalty"
              value={metrics.metrics.weightedDelta.stabilityPenalty.toFixed(2)}
              helper="Volatility-adjusted"
            />
            <MetricTile
              label="Adoption weight"
              value={metrics.metrics.weightedDelta.adoptionWeight.toFixed(2)}
              helper="Scaled from adoption score"
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Health snapshot" description="Derived from completeness, transparency, and velocity">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricTile label="Health" value={`${health.healthScore}`} helper="Composite out of 100" />
          <MetricTile
            label="Spike direction"
            value={health.spikeDirection ?? "none"}
            helper="Based on Δ threshold"
          />
          <MetricTile
            label="Evidence signals"
            value={`${health.evidence.signals}`}
            helper={`Missing buckets: ${health.evidence.missingBuckets.join(", ") || "none"}`}
          />
        </div>
      </SectionCard>
    </div>
  );
}

function formatDelta(value: number) {
  if (value > 0) return `+${value.toFixed(2)}`;
  if (value < 0) return value.toFixed(2);
  return "0.00";
}
