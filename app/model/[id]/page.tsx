import modelsData from "@/data/models/index.json";
import type { Model } from "@/types/model";
import Link from "next/link";
import HistorySparkline from "@/components/HistorySparkline";
import EvidenceSection from "@/components/EvidenceSection";
import {
  DELTA_WINDOW_DAYS,
  formatDelta,
  getSpikeDirection
} from "@/lib/models";

const models = modelsData as Model[];

interface Params {
  id: string;
}

export async function generateStaticParams() {
  return models.map((m) => ({ id: m.id }));
}

export default function ModelPage({ params }: { params: Params }) {
  const model = models.find((m) => m.id === params.id);

  if (!model) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-400">Model not found.</p>
        <Link href="/" className="text-sm text-accent">
          ← Back to scores
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-xs text-accent">
        ← Back to scores
      </Link>

      <header className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-surface/60 p-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-50">
              {model.name}
            </h1>
            <StatusChip model={model} />
          </div>
          <p className="text-sm text-slate-400">{model.provider}</p>
          {model.waiting && (
            <p className="text-[0.7rem] text-amber-300">
              Waiting on more public evidence. Scores may change as data matures.
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Total score
          </div>
          <div className="text-3xl font-semibold text-slate-50">
            {model.total.toFixed(1)}
          </div>
          <div className="text-xs text-slate-500">
            Δ {DELTA_WINDOW_DAYS}d{" "}
            <span className={deltaColor(model.delta)}>
              {formatDelta(model.delta)}
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-slate-800 bg-surface/60 p-4 text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Core metrics
          </h2>
          <div className="space-y-2 text-xs">
            <MetricRow label="Performance" value={model.scores.performance} />
            <MetricRow label="Safety" value={model.scores.safety} />
            <MetricRow label="Cost / Efficiency" value={model.scores.cost} />
            <MetricRow
              label="Transparency"
              value={model.scores.transparency}
            />
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-800 bg-surface/60 p-4 text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Categories
          </h2>
          <div className="space-y-2 text-xs">
            <CategoryRow label="Text / Chat" value={model.categories?.text} />
            <CategoryRow label="Coding" value={model.categories?.coding} />
            <CategoryRow label="Vision" value={model.categories?.vision} />
            <CategoryRow label="Image generation" value={model.categories?.image} />
            <CategoryRow label="Video generation" value={model.categories?.video} />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-surface/60 p-4 text-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Trend (total score)
        </h2>
        <HistorySparkline history={model.history} />
        <p className="text-[0.65rem] text-slate-500">
          Δ window {DELTA_WINDOW_DAYS} days. Raw checkpoints are normalized
          before a new release is added to the scoreboard.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-surface/60 p-4 text-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Evidence
        </h2>
        <EvidenceSection evidence={model.evidence} />
        <p className="text-[0.65rem] text-slate-500">
          Every reference is public. Links will expand as Phase 1 sources are
          published.
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

function StatusChip({ model }: { model: Model }) {
  const spike = getSpikeDirection(model.delta, model.waiting);
  if (!spike) return null;

  const baseClass =
    "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide";

  if (spike === "waiting") {
    return (
      <span className={`${baseClass} bg-slate-600/30 text-slate-200`}>
        Waiting
      </span>
    );
  }

  const palette = spike === "up"
    ? { bg: "bg-positive/10", text: "text-positive", label: "Spike ↑" }
    : { bg: "bg-negative/10", text: "text-negative", label: "Spike ↓" };

  return (
    <span className={`${baseClass} ${palette.bg} ${palette.text}`}>
      {palette.label}
    </span>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-300">{label}</span>
      <span className="font-semibold text-slate-50">{value}</span>
    </div>
  );
}

function CategoryRow({
  label,
  value
}: {
  label: string;
  value?: number | null;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-300">{label}</span>
      <span className="font-semibold text-slate-50">
        {value == null ? "—" : value}
      </span>
    </div>
  );
}
