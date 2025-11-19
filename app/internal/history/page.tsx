import HistorySparkline from "@/components/HistorySparkline";
import {
  DELTA_WINDOW_DAYS,
  formatDelta,
  getModelDelta,
  getModels,
  getSortedModels
} from "@/lib/models";
import { getHistoryDerivedStats, type VolatilityBucket } from "@/lib/historyStats";
import type { Model } from "@/types/model";

const models = getSortedModels(getModels());

const volatilityCopy: Record<VolatilityBucket, string> = {
  stable: "Std dev < 1 · quiet drift",
  mixed: "Std dev 1-2.5 · watch list",
  volatile: "Std dev > 2.5 · large swings"
};

export const metadata = {
  title: "Internal history · AI Model Scoreboard"
};

export default function InternalHistoryPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          aims-v2 internal
        </p>
        <h1 className="text-3xl font-semibold text-slate-50">History & update monitor</h1>
        <p className="max-w-3xl text-sm text-slate-400">
          Debug-only view that mirrors the public leaderboard data without changing the
          public navigation. Each card lists the raw history entries behind the {DELTA_WINDOW_DAYS}-day delta
          plus derived stats used for upcoming dashboards.
        </p>
      </section>

      <div className="grid gap-6">
        {models.map((model) => (
          <HistoryCard key={model.slug} model={model} />
        ))}
      </div>
    </div>
  );
}

function HistoryCard({ model }: { model: Model }) {
  const stats = getHistoryDerivedStats(model.history);
  const history = [...(model.history ?? [])];
  const recent = history.slice(-6).reverse();
  const delta = stats.delta30 ?? getModelDelta(model);

  return (
    <article className="rounded-2xl border border-slate-800 bg-surface/80 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {model.vendor ?? model.provider}
          </p>
          <div>
            <h2 className="text-2xl font-semibold text-slate-50">{model.name}</h2>
            <p className="text-sm text-slate-400">
              Total {model.total.toFixed(1)} · Δ{DELTA_WINDOW_DAYS}d {formatDelta(delta)}
            </p>
          </div>
          <p className="text-[0.7rem] text-slate-500">
            {model.modalities?.join(" · ") ?? model.modality}
          </p>
        </div>
        <div className="w-full lg:max-w-sm">
          <HistorySparkline history={model.history} chartId={model.slug} />
        </div>
      </div>

      <dl className="mt-4 grid gap-4 text-sm text-slate-300 md:grid-cols-3">
        <div>
          <dt className="text-[0.65rem] uppercase tracking-wide text-slate-500">Δ window</dt>
          <dd className="text-lg font-semibold text-slate-50">{formatDelta(delta)}</dd>
          <p className="text-[0.65rem] text-slate-500">Computed from extended history</p>
        </div>
        <div>
          <dt className="text-[0.65rem] uppercase tracking-wide text-slate-500">Volatility</dt>
          <dd className="text-lg font-semibold capitalize text-slate-50">{stats.volatility}</dd>
          <p className="text-[0.65rem] text-slate-500">{volatilityCopy[stats.volatility]}</p>
        </div>
        <div>
          <dt className="text-[0.65rem] uppercase tracking-wide text-slate-500">Recent updates</dt>
          <dd className="text-lg font-semibold text-slate-50">{stats.updateCount30}</dd>
          <p className="text-[0.65rem] text-slate-500">
            Entries within the last {DELTA_WINDOW_DAYS} days
          </p>
        </div>
      </dl>

      <div className="mt-5">
        <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">Latest checkpoints</p>
        <ul className="mt-2 divide-y divide-slate-800 text-sm">
          {recent.map((entry) => (
            <li key={`${model.slug}-${entry.date}`} className="flex items-center justify-between py-1.5">
              <span className="text-slate-400">{formatHistoryDate(entry.date)}</span>
              <span className="font-semibold text-slate-100">{entry.total.toFixed(1)}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function formatHistoryDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit"
  }).format(new Date(date));
}
