import Link from "next/link";
import { notFound } from "next/navigation";
import EvidenceSection from "@/components/EvidenceSection";
import HistorySparkline from "@/components/HistorySparkline";
import StatusPills from "@/components/StatusPills";
import {
  DELTA_WINDOW_DAYS,
  formatDelta,
  getModelBySlug,
  getModelDelta,
  getModelStatuses,
  getModels,
  getSortedModels
} from "@/lib/models";
import type { Model } from "@/types/model";

const models = getModels();
const sortedModels = getSortedModels(models);

interface Params {
  slug: string;
}

export async function generateStaticParams() {
  return models.map((model) => ({ slug: model.slug }));
}

export default function ModelPage({ params }: { params: Params }) {
  const model = getModelBySlug(params.slug);

  if (!model) {
    notFound();
  }

  const rank = sortedModels.findIndex((entry) => entry.slug === model.slug) + 1;
  const statuses = getModelStatuses(model, rank);
  const scoreCards = getScoreCards(model);
  const delta = getModelDelta(model);

  return (
    <div className="space-y-6">
      <Link href="/" className="text-xs text-accent">
        ← Back to leaderboard
      </Link>

      <header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-surface/80 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Vendor</p>
            <h1 className="text-3xl font-semibold text-slate-50">{model.name}</h1>
            <p className="text-sm text-slate-400">{model.vendor ?? model.provider}</p>
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
          <StatusPills statuses={statuses} size="md" />
          {model.waiting && (
            <p className="text-[0.7rem] text-amber-300">
              Waiting on public evaluations. Scores will refresh once new evidence lands.
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total score</p>
          <p className="text-4xl font-semibold text-slate-50">{model.total.toFixed(1)}</p>
          <p className="text-sm text-slate-400">
            Δ {DELTA_WINDOW_DAYS}d {" "}
            <span className={deltaColor(delta)}>{formatDelta(delta)}</span>
          </p>
          <p className="text-xs text-slate-500">Ranked #{rank}</p>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-surface/80 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Score breakdown
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scoreCards.map((card) => (
            <div key={card.label} className="rounded-xl bg-background/40 px-3 py-4">
              <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <p className="text-2xl font-semibold text-slate-50">{card.value}</p>
              <p className="text-[0.7rem] text-slate-500">{card.helper}</p>
            </div>
          ))}
        </div>
      </section>

      {model.categories && (
        <section className="rounded-2xl border border-slate-800 bg-surface/80 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Capability coverage
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {Object.entries(model.categories).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-xl bg-background/30 px-3 py-2 text-sm">
                <span className="text-slate-300">{formatCategoryLabel(key)}</span>
                <span className="font-semibold text-slate-50">{value == null ? "—" : value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-800 bg-surface/80 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          30-day sparkline
        </h2>
        <div className="mt-3">
          <HistorySparkline history={model.history} />
        </div>
        <p className="text-[0.65rem] text-slate-500">
          Mock history shown for aims-v1 preview. Δ window {DELTA_WINDOW_DAYS} days.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-surface/80 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Evidence grid
        </h2>
        <div className="mt-3">
          <EvidenceSection evidence={model.evidence} />
        </div>
        <p className="text-[0.65rem] text-slate-500">
          Placeholder links documented per scoring category. All data stays in local JSON.
        </p>
      </section>
    </div>
  );
}

function deltaColor(delta: number) {
  if (delta > 0) return "text-positive";
  if (delta < 0) return "text-negative";
  return "text-slate-300";
}

function getScoreCards(model: Model) {
  return [
    { label: "Performance", value: model.scores.performance, helper: "Benchmarks & eval suites" },
    { label: "Safety", value: model.scores.safety, helper: "Alignment & red-teaming" },
    { label: "Cost", value: model.scores.cost, helper: "Pricing & efficiency" },
    { label: "Reliability", value: model.scores.reliability, helper: "Uptime & release cadence" },
    { label: "Transparency", value: model.scores.transparency, helper: "Policies & reporting" },
    { label: "Ecosystem", value: model.scores.ecosystem, helper: "Partners & tooling" },
    { label: "Adoption", value: model.scores.adoption, helper: "Usage & interest" }
  ];
}

function formatCategoryLabel(key: string) {
  const labels: Record<string, string> = {
    text: "Text / Chat",
    coding: "Coding",
    vision: "Vision",
    image: "Image",
    video: "Video"
  };
  return labels[key] ?? key;
}
