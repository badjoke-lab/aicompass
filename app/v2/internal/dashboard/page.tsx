import { SparkBars } from "@/components/v2/dashboard/SparkBars";
import { getInternalDashboardData } from "@/lib/v2/getInternalDashboardData";
import { v2ScoreEngine } from "@/lib/v2/scoreEngine";
import type { V2ModelWithMetrics } from "@/lib/v2/types";

const dashboard = getInternalDashboardData();
const snapshots = v2ScoreEngine.getSnapshots();

export const metadata = {
  title: "AIMS v2 internal dashboard"
};

export default function InternalDashboardPage() {
  const ecosystemLeaders = [...snapshots]
    .sort((a, b) => b.metrics.ecosystemDepth.depth - a.metrics.ecosystemDepth.depth)
    .slice(0, 3);

  const summaryCards = [
    {
      label: "Global health",
      value: `${dashboard.summary.globalHealthScore}/100`,
      helper: "Composite metadata, evidence, transparency, stability"
    },
    {
      label: "Tracked models",
      value: `${dashboard.summary.tracked}`,
      helper: `Active ${dashboard.summary.active} · Waiting ${dashboard.summary.waiting}`
    },
    {
      label: "Transparency median",
      value: `${dashboard.summary.medianTransparency.toFixed(1)}%`,
      helper: "Ratio of transparency vs disclosure"
    },
    {
      label: "Completeness",
      value: `${dashboard.summary.metadataAverage.toFixed(1)}% / ${dashboard.summary.evidenceAverage.toFixed(1)}%`,
      helper: "Metadata · Evidence averages"
    }
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2 · internal</p>
        <h1 className="text-3xl font-semibold text-slate-50">Metrics cockpit</h1>
        <p className="max-w-3xl text-sm text-slate-400">
          Private-only snapshot that blends v2 completeness, volatility, transparency, and ecosystem depth without touching
          the public surface.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-800 bg-surface/80 p-4 shadow-sm">
            <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">{card.value}</p>
            <p className="text-xs text-slate-500">{card.helper}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-surface/80 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Volatility mix</p>
              <p className="text-lg font-semibold text-slate-50">{Object.values(dashboard.summary.volatilityMix).reduce((a, b) => a + b, 0)} models</p>
              <p className="text-xs text-slate-500">Stable · Mixed · Volatile</p>
            </div>
            <SparkBars
              bars={["stable", "mixed", "volatile"].map((bucket) => dashboard.summary.volatilityMix[bucket as keyof typeof dashboard.summary.volatilityMix] ?? 0)}
              max={Math.max(...Object.values(dashboard.summary.volatilityMix)) || 1}
            />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {Object.entries(dashboard.summary.volatilityMix).map(([bucket, count]) => (
              <div key={bucket} className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-2 text-xs text-slate-300">
                <p className="font-semibold capitalize text-slate-50">{bucket}</p>
                <p className="text-slate-400">{count} tracked</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-surface/80 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Spikes</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <AlertList title="Gainers" items={dashboard.anomalies.gainers} tone="up" />
            <AlertList title="Droppers" items={dashboard.anomalies.droppers} tone="down" />
          </div>
          <div className="mt-4">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Transparency alerts</p>
            <AlertTransparency items={dashboard.anomalies.transparency} />
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-surface/80 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Metadata completeness</p>
          <p className="text-2xl font-semibold text-slate-50">{dashboard.summary.metadataAverage.toFixed(1)}%</p>
          <p className="text-xs text-slate-500">Coverage across vendor, release, disclosure, and sizing</p>
          <div className="mt-3 space-y-2">
            {dashboard.metadata.coverage.slice(0, 3).map((field) => (
              <FieldRow key={field.key} label={field.label} value={field.coveragePercent} />
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {dashboard.metadata.strongest.map((entry) => (
              <MiniCard key={entry.slug} title={entry.name} subtitle={entry.vendor} value={`${entry.ratio.toFixed(1)}%`} />
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-surface/80 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Evidence completeness</p>
          <p className="text-2xl font-semibold text-slate-50">{dashboard.summary.evidenceAverage.toFixed(1)}%</p>
          <p className="text-xs text-slate-500">Benchmarks, safety, pricing, technical, curated notes</p>
          <div className="mt-3 space-y-2">
            {dashboard.evidence.coverage.slice(0, 3).map((bucket) => (
              <FieldRow key={bucket.key} label={bucket.label} value={bucket.completeness} />
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {dashboard.evidence.weakest.map((entry) => (
              <MiniCard
                key={entry.slug}
                title={entry.name}
                subtitle={entry.vendor}
                value={`${entry.ratio.toFixed(1)}%`}
                footnote={entry.missingBuckets.length ? `Missing ${entry.missingBuckets.join(", ")}` : undefined}
              />
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-surface/80 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Velocity</p>
          <p className="text-lg font-semibold text-slate-50">Δ{dashboard.summary.coveragePercent}% coverage</p>
          <p className="text-xs text-slate-500">Trend leaders and watchlist</p>
          <div className="mt-3 space-y-3">
            {dashboard.trendLeaders.map((entry) => (
              <TrendRow key={entry.slug} entry={entry} />
            ))}
            {dashboard.trendWatch.map((entry) => (
              <TrendRow key={entry.slug} entry={entry} muted />
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-surface/80 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">Ecosystem depth</p>
          <p className="text-lg font-semibold text-slate-50">Modalities × adoption × evidence</p>
          <div className="mt-3 space-y-3">
            {ecosystemLeaders.map((entry) => (
              <EcosystemRow key={entry.model.slug} entry={entry} />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-2 text-xs text-slate-300">
      <div>
        <p className="font-semibold text-slate-50">{label}</p>
        <p className="text-[0.7rem] text-slate-500">Coverage</p>
      </div>
      <SparkBars bars={[value]} max={100} />
    </div>
  );
}

function MiniCard({
  title,
  subtitle,
  value,
  footnote
}: {
  title: string;
  subtitle: string;
  value: string;
  footnote?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-2 text-sm text-slate-300">
      <p className="font-semibold text-slate-50">{title}</p>
      <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{subtitle}</p>
      <p className="text-xs text-slate-400">{value}</p>
      {footnote ? <p className="text-[0.65rem] text-slate-500">{footnote}</p> : null}
    </div>
  );
}

function AlertList({
  title,
  items,
  tone
}: {
  title: string;
  items: Array<{ slug: string; name: string; vendor: string; deltaLabel: string; total: number }>;
  tone: "up" | "down";
}) {
  return (
    <div>
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <div className="mt-2 space-y-2 text-sm">
        {items.length === 0 ? <p className="text-xs text-slate-600">None</p> : null}
        {items.map((item) => (
          <div key={item.slug} className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-2">
            <div>
              <p className="font-semibold text-slate-50">{item.name}</p>
              <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{item.vendor}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${tone === "up" ? "text-emerald-400" : "text-rose-400"}`}>{item.deltaLabel}</p>
              <p className="text-[0.7rem] text-slate-500">Total {item.total.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertTransparency({
  items
}: {
  items: Array<{ slug: string; name: string; vendor: string; ratio: number; transparencyScore: number; disclosureScore: number }>;
}) {
  return (
    <div className="mt-2 space-y-2 text-sm">
      {items.length === 0 ? <p className="text-xs text-slate-600">No violations</p> : null}
      {items.map((item) => (
        <div key={item.slug} className="flex items-center justify-between rounded-xl border border-amber-900/50 bg-amber-950/20 px-3 py-2">
          <div>
            <p className="font-semibold text-amber-100">{item.name}</p>
            <p className="text-[0.7rem] uppercase tracking-wide text-amber-400">{item.vendor}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-amber-200">{(item.ratio * 100).toFixed(0)}%</p>
            <p className="text-[0.65rem] text-amber-300">T {item.transparencyScore} · D {item.disclosureScore.toFixed(1)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendRow({ entry, muted = false }: { entry: { name: string; vendor: string; velocity: number; delta: number }; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-xl border border-slate-800/70 px-3 py-2 text-sm ${muted ? "bg-slate-900/30 text-slate-400" : "bg-slate-900/50 text-slate-200"}`}>
      <div>
        <p className="font-semibold text-slate-50">{entry.name}</p>
        <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{entry.vendor}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-emerald-400">{entry.velocity.toFixed(2)} / wk</p>
        <p className="text-[0.7rem] text-slate-500">Δ{entry.delta.toFixed(2)}</p>
      </div>
    </div>
  );
}

function EcosystemRow({ entry }: { entry: V2ModelWithMetrics }) {
  const depth = entry.metrics.ecosystemDepth;
  return (
    <div className="rounded-xl border border-slate-800/70 bg-slate-900/50 px-3 py-3 text-sm text-slate-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-50">{entry.model.name}</p>
          <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{entry.metrics.vendor}</p>
        </div>
        <p className="text-lg font-semibold text-blue-300">{depth.depth.toFixed(1)}</p>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <SparkBars bars={[depth.modalityBonus]} max={25} label="Modalities" />
        <SparkBars bars={[depth.coverageBonus]} max={25} label="Evidence" />
        <SparkBars bars={[depth.evidenceSignals]} max={10} label="Signals" />
      </div>
    </div>
  );
}
