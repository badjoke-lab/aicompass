import Link from "next/link";
import { notFound } from "next/navigation";
import EvidenceSection from "@/components/EvidenceSection";
import HistorySparkline from "@/components/HistorySparkline";
import { DELTA_WINDOW_DAYS } from "@/lib/models";
import { v2ScoreEngine } from "@/lib/v2";

const snapshots = v2ScoreEngine.getSnapshots();
const ranked = [...snapshots].sort((a, b) => b.metrics.total - a.metrics.total);

interface Params {
  slug: string;
}

export async function generateStaticParams() {
  return snapshots.map((entry) => ({ slug: entry.model.slug }));
}

export function generateMetadata({ params }: { params: Params }) {
  const entry = v2ScoreEngine.getBySlug(params.slug);
  if (!entry) return {};
  return {
    title: `${entry.metrics.name} · AI Model Scoreboard`,
    description: `Scores and evidence for ${entry.metrics.name} from the aims-v2 model data.`,
  };
}

export default function ModelPage({ params }: { params: Params }) {
  const entry = v2ScoreEngine.getBySlug(params.slug);
  if (!entry) {
    notFound();
  }

  const rank = ranked.findIndex((item) => item.model.slug === entry.model.slug) + 1;
  const { model, metrics } = entry;
  const scoreCards = getScoreCards(model);
  const transparencyPercent = Math.round(metrics.transparencyCompliance.ratio * 100);
  const ecosystemPercent = Math.min(120, metrics.ecosystemDepth.depth) / 120;

  return (
    <div className="space-y-8">
      <Link href="/scores" className="text-xs text-accent">
        ← Back to scores
      </Link>

      <header className="rounded-2xl border border-slate-800 bg-surface/80 p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">AI Model Scoreboard</p>
              <h1 className="text-3xl font-semibold text-slate-50">{metrics.name}</h1>
              <p className="text-sm text-slate-400">{metrics.vendor}</p>
            </div>
            {model.modalities && model.modalities.length > 0 && (
              <div className="flex flex-wrap gap-2 text-[0.65rem]">
                {model.modalities.map((modality) => (
                  <span
                    key={modality}
                    className="rounded-full bg-slate-800/70 px-3 py-1 font-semibold uppercase tracking-wide text-slate-300"
                  >
                    {modality}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total score</p>
            <p className="text-4xl font-semibold text-slate-50">{metrics.total.toFixed(1)}</p>
            <p className="text-sm text-slate-400">
              Weighted Δ {metrics.weightedDelta.value.toFixed(2)} · {DELTA_WINDOW_DAYS}-day window
            </p>
            <p className="text-xs text-slate-500">Ranked #{rank}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetaTile
            label="Trend velocity"
            value={`${metrics.trendVelocity.velocity.toFixed(2)} /wk`}
            helper={`Δ ${metrics.trendVelocity.delta.toFixed(1)} over ${metrics.trendVelocity.windowDays}d`}
          />
          <MetaTile
            label="Volatility"
            value={metrics.volatilityBucket}
            helper={`Index ${metrics.volatilityIndex.toFixed(2)}`}
          />
          <MetaTile
            label="Transparency"
            value={`${transparencyPercent}% compliance`}
            helper={`Training + eval disclosure score ${metrics.transparencyCompliance.disclosureScore}`}
          />
          <MetaTile
            label="Ecosystem depth"
            value={`${metrics.ecosystemDepth.depth.toFixed(1)} pts`}
            helper={`${metrics.ecosystemDepth.evidenceSignals} evidence signals · modality bonus ${metrics.ecosystemDepth.modalityBonus.toFixed(1)}`}
          />
        </div>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-surface/80 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Score breakdown</p>
            <p className="text-sm text-slate-500">Core subscores from the aims-v2 model record.</p>
          </div>
          <p className="text-xs text-slate-500">Adoption and ecosystem factor into weighted delta.</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scoreCards.map((card) => (
            <div key={card.label} className="rounded-xl bg-background/40 px-3 py-4">
              <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{card.label}</p>
              <p className="text-2xl font-semibold text-slate-50">{card.value}</p>
              <p className="text-[0.7rem] text-slate-500">{card.helper}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-surface/80 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Trend & stability</p>
              <p className="text-sm text-slate-500">Weighted deltas incorporate stability, adoption, and performance weights.</p>
            </div>
            <p className="text-xs text-slate-500">Volatility index {metrics.volatilityIndex.toFixed(2)}</p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-background/40 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">Weighted Δ</p>
              <p className="text-2xl font-semibold text-slate-50">{metrics.weightedDelta.value.toFixed(2)}</p>
              <p className="text-sm text-slate-400">
                Raw Δ {metrics.weightedDelta.rawDelta.toFixed(1)} · stability ×{metrics.weightedDelta.stabilityPenalty.toFixed(2)} · momentum {metrics.weightedDelta.momentumBoost.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl bg-background/40 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">Trend velocity</p>
              <p className={`text-2xl font-semibold ${metrics.trendVelocity.velocity >= 0 ? "text-positive" : "text-negative"}`}>
                {metrics.trendVelocity.velocity.toFixed(2)} /wk
              </p>
              <p className="text-sm text-slate-400">
                Δ {metrics.trendVelocity.delta.toFixed(1)} across {metrics.trendVelocity.sampleCount} samples
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">History sparkline</p>
            <HistorySparkline history={model.history} chartId={model.slug} />
            <p className="text-[0.7rem] text-slate-500">{DELTA_WINDOW_DAYS}-day delta window used for weighted changes.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-surface/80 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Transparency & ecosystem</p>
          <div className="mt-3 space-y-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-300">Transparency compliance</p>
                <span className="font-semibold text-slate-50">{transparencyPercent}%</span>
              </div>
              <RatioBar ratio={metrics.transparencyCompliance.ratio} label="compliance" />
              <p className="text-[0.75rem] text-slate-500">
                Transparency score {metrics.transparencyCompliance.transparencyScore} · disclosure {metrics.transparencyCompliance.disclosureScore}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-300">Ecosystem depth</p>
                <span className="font-semibold text-slate-50">{metrics.ecosystemDepth.depth.toFixed(1)} pts</span>
              </div>
              <RatioBar ratio={ecosystemPercent} label="ecosystem" />
              <p className="text-[0.75rem] text-slate-500">
                {metrics.ecosystemDepth.evidenceSignals} evidence signals · coverage bonus {metrics.ecosystemDepth.coverageBonus.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-surface/80 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Evidence</p>
            <p className="text-sm text-slate-500">Public sources that inform the current scores.</p>
          </div>
          <p className="text-xs text-slate-500">Links open externally; data stays local.</p>
        </div>
        <div className="mt-3">
          <EvidenceSection evidence={model.evidence} />
        </div>
      </section>
    </div>
  );
}

function getScoreCards(model: typeof snapshots[number]["model"]) {
  return [
    { label: "Performance", value: formatScore(model.scores.performance), helper: "Benchmarks & eval suites" },
    { label: "Safety", value: formatScore(model.scores.safety), helper: "Alignment & red-teaming" },
    { label: "Cost", value: formatScore(model.scores.cost), helper: "Pricing & efficiency" },
    { label: "Reliability", value: formatScore(model.scores.reliability), helper: "Uptime & release cadence" },
    { label: "Transparency", value: formatScore(model.scores.transparency), helper: "Policies & reporting" },
    { label: "Ecosystem", value: formatScore(model.scores.ecosystem), helper: "Partners & tooling" },
    { label: "Adoption", value: formatScore(model.scores.adoption), helper: "Usage & interest" }
  ];
}

function formatScore(value: number | undefined) {
  if (value == null) return "—";
  return Number(value).toFixed(0);
}

function RatioBar({ ratio, label }: { ratio: number; label: string }) {
  const width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
  return (
    <div>
      <div className="h-2 w-full rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-accent" style={{ width }} />
      </div>
      <p className="mt-1 text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

function MetaTile({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-xl bg-background/40 px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-50">{value}</p>
      <p className="text-[0.75rem] text-slate-500">{helper}</p>
    </div>
  );
}
