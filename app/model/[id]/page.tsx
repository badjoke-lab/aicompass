import modelsData from "@/data/models/index.json";
import type { Model } from "@/components/ModelCard";
import Link from "next/link";

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
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            {model.name}
          </h1>
          <p className="text-sm text-slate-400">{model.provider}</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Total score
          </div>
          <div className="text-3xl font-semibold text-slate-50">
            {model.total.toFixed(1)}
          </div>
          <div className="text-xs text-slate-500">
            Δ 30d{" "}
            <span
              className={
                model.delta > 0
                  ? "text-positive"
                  : model.delta < 0
                    ? "text-negative"
                    : "text-slate-300"
              }
            >
              {model.delta > 0 ? "+" : ""}
              {model.delta.toFixed(1)}
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

      {/* ここは後で本格的なグラフに差し替える */}
      <section className="space-y-3 rounded-xl border border-slate-800 bg-surface/60 p-4 text-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Trend (total score)
        </h2>
        <p className="text-xs text-slate-400">
          Trend visualization will be added later. For now, raw history data:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-950/60 p-3 text-[0.7rem] text-slate-200">
{JSON.stringify((model as any).history ?? [], null, 2)}
        </pre>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-surface/60 p-4 text-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Evidence (sample)
        </h2>
        <p className="text-xs text-slate-400">
          Evidence links here are placeholders. In Phase 1, they will be filled
          with real URLs for pricing, benchmarks, safety, and reports.
        </p>
      </section>
    </div>
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
