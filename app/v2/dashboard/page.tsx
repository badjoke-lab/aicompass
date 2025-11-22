import Link from "next/link";
import EcosystemRow from "@/components/v2/EcosystemRow";
import SparkBars from "@/components/v2/SparkBars";
import TrendPanel from "@/components/v2/TrendPanel";
import SectionCard from "@/components/v2/SectionCard";
import RatioBar from "@/components/v2/RatioBar";
import { loadDashboard, formatPercent, formatRatio } from "./helpers";

const dashboard = loadDashboard();

export const metadata = {
  title: "AIMS v2 · Internal diagnostics"
};

export default function V2DashboardPage() {
  const topHealth = [...dashboard.modelHealth].sort((a, b) => b.healthScore - a.healthScore).slice(0, 6);
  const ecosystemLeaders = [...dashboard.metrics]
    .sort((a, b) => b.metrics.ecosystemDepth.depth - a.metrics.ecosystemDepth.depth)
    .slice(0, 5);

  return (
    <main className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-50">Internal diagnostics cockpit</h1>
          <p className="max-w-5xl text-sm text-slate-400">
            Fully isolated v2-only surface combining the new score engine snapshots, transparency compliance,
            evidence coverage, and velocity signals. No v1 helpers or UI dependencies are referenced.
          </p>
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-slate-500">
            Generated {new Date(dashboard.summary.generatedAt).toLocaleString()}
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryTile label="Global health" value={`${dashboard.summary.globalHealthScore}`} helper="Composite quality" />
        <SummaryTile
          label="Model coverage"
          value={`${dashboard.summary.tracked} tracked`}
          helper={`Active ${dashboard.summary.active} · Waiting ${dashboard.summary.waiting}`}
        />
        <SummaryTile
          label="Median transparency"
          value={formatPercent(dashboard.summary.medianTransparency, 1)}
          helper="Compliance vs disclosure" 
        />
        <SummaryTile
          label="Completeness"
          value={`${formatPercent(dashboard.summary.metadataAverage, 1)} / ${formatPercent(dashboard.summary.evidenceAverage, 1)}`}
          helper="metadata / evidence"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Spike gainers" subtitle="Delta momentum" padded>
          <AnomalyList entries={dashboard.anomalies.gainers} emptyLabel="No gainers" />
        </SectionCard>
        <SectionCard title="Spike droppers" subtitle="Downward momentum" padded>
          <AnomalyList entries={dashboard.anomalies.droppers} emptyLabel="No droppers" negative />
        </SectionCard>
        <SectionCard title="Transparency watch" subtitle="Ratio below threshold" padded>
          <TransparencyList entries={dashboard.anomalies.transparency} />
        </SectionCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Metadata coverage" subtitle="Required disclosures" padded>
          <CoverageSummary coverage={dashboard.metadata.coverage.map((item) => ({
            label: item.label,
            percent: item.coveragePercent
          }))} average={dashboard.metadata.averageRatio} strongest={dashboard.metadata.strongest} weakest={dashboard.metadata.weakest} />
        </SectionCard>
        <SectionCard title="Evidence depth" subtitle="Signals by bucket" padded>
          <CoverageSummary
            coverage={dashboard.evidence.coverage.map((bucket) => ({
              label: bucket.label,
              percent: bucket.completeness
            }))}
            average={dashboard.evidence.averageRatio}
            weakest={dashboard.evidence.weakest}
          />
        </SectionCard>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-surface/80 p-5 shadow-lg">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">health</p>
          <h2 className="text-2xl font-semibold text-slate-50">Integrity table</h2>
          <p className="text-sm text-slate-400">Prioritized by composite health score across completeness, transparency, stability, and velocity.</p>
        </div>
        <div className="mt-4 divide-y divide-slate-800/70 text-sm">
          {topHealth.map((row) => (
            <div key={row.slug} className="grid gap-3 py-4 md:grid-cols-12 md:items-center">
              <div className="md:col-span-3">
                <Link
                  href={`/v2/models/${row.slug}`}
                  className="font-semibold text-slate-50 underline-offset-4 hover:text-accent hover:underline"
                >
                  {row.name}
                </Link>
                <p className="text-xs uppercase tracking-wide text-slate-500">{row.vendor}</p>
                <p className="text-[0.7rem] text-slate-500">Total {row.total.toFixed(1)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-lg font-semibold text-slate-50">{row.healthScore}</p>
                <p className="text-xs text-slate-500">
                  {row.spikeDirection ? `Spike ${row.spikeDirection}` : "Normal"}
                  {row.transparencyViolation ? " · Transparency watch" : ""}
                </p>
              </div>
              <div className="md:col-span-2">
                <RatioBar
                  ratio={row.metadata.ratio}
                  label={`${row.metadata.present.length}/${row.metadata.present.length + row.metadata.missing.length} metadata`}
                />
              </div>
              <div className="md:col-span-2">
                <RatioBar ratio={row.evidence.ratio} label={`${row.evidence.signals} signals`} />
              </div>
              <div className="md:col-span-1 text-sm">
                <div className="font-semibold text-slate-50">{formatRatio(row.transparencyRatio)}</div>
                <p className="text-[0.7rem] text-slate-500">transparency</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-slate-50">{row.trendVelocity.velocity.toFixed(2)} / wk</p>
                <p className="text-[0.7rem] text-slate-500">Δ{row.trendVelocity.delta.toFixed(1)} over {row.trendVelocity.sampleCount} pts</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TrendPanel title="Velocity leaders" description="> +0.25 per week" data={dashboard.trendLeaders} />
        <TrendPanel title="Velocity watch" description="< -0.2 per week" data={dashboard.trendWatch} />
      </section>

      <section className="rounded-3xl border border-slate-800 bg-surface/80 p-5 shadow-lg">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">ecosystem</p>
          <h2 className="text-2xl font-semibold text-slate-50">Depth snapshot</h2>
          <p className="text-sm text-slate-400">Top models by ecosystem signals and adoption, sourced from v2 score engine snapshots.</p>
        </div>
        <div className="mt-4 divide-y divide-slate-800/70">
          {ecosystemLeaders.map((entry, index) => (
            <EcosystemRow key={entry.model.slug} entry={entry} rank={index + 1} />
          ))}
        </div>
      </section>
    </main>
  );
}

function SummaryTile({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-surface/80 p-4 shadow-sm">
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </article>
  );
}

function AnomalyList({ entries, emptyLabel, negative }: { entries: Array<{ slug: string; name: string; vendor: string; deltaLabel: string; total: number }>; emptyLabel: string; negative?: boolean }) {
  if (!entries.length) {
    return <p className="text-sm text-slate-500">{emptyLabel}</p>;
  }
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.slug} className="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/v2/models/${entry.slug}`}
                className="font-semibold text-slate-50 underline-offset-4 hover:text-accent hover:underline"
              >
                {entry.name}
              </Link>
              <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{entry.vendor}</p>
            </div>
            <div className={`font-mono text-sm ${negative ? "text-negative" : "text-positive"}`}>{entry.deltaLabel}</div>
          </div>
          <p className="text-xs text-slate-500">Current {entry.total.toFixed(1)}</p>
        </div>
      ))}
    </div>
  );
}

function TransparencyList({ entries }: { entries: typeof dashboard.anomalies.transparency }) {
  if (!entries.length) {
    return <p className="text-sm text-slate-500">All models meet the transparency ratio target.</p>;
  }
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.slug} className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/v2/models/${entry.slug}`}
                className="font-semibold underline-offset-4 hover:text-white hover:underline"
              >
                {entry.name}
              </Link>
              <p className="text-[0.7rem] uppercase tracking-wide text-amber-200/80">{entry.vendor}</p>
            </div>
            <span className="font-mono">{formatRatio(entry.ratio)}</span>
          </div>
          <p className="text-[0.7rem] text-amber-200/70">Transparency {entry.transparencyScore} vs expected {entry.disclosureScore}</p>
        </div>
      ))}
    </div>
  );
}

function CoverageSummary({
  coverage,
  average,
  strongest,
  weakest
}: {
  coverage: Array<{ label: string; percent: number }>;
  average: number;
  strongest?: Array<{ slug: string; name: string; vendor: string; ratio: number }>;
  weakest?: Array<{ slug: string; name: string; vendor: string; ratio: number; missing?: string[] }>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Coverage</p>
          <p className="text-xl font-semibold text-slate-50">{formatPercent(average * 100, 1)} avg</p>
        </div>
        <SparkBars values={coverage.map((item) => item.percent)} className="w-40" />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {coverage.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="text-lg font-semibold text-slate-50">{formatPercent(item.percent, 1)}</p>
          </div>
        ))}
      </div>
      {strongest?.length ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Strongest</p>
          <div className="space-y-2">
            {strongest.map((entry) => (
              <Link
                key={entry.slug}
                href={`/v2/models/${entry.slug}`}
                className="block rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100"
              >
                <span className="font-semibold">{entry.name}</span> · {entry.vendor} · {formatPercent(entry.ratio, 1)}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {weakest?.length ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Weakest</p>
          <div className="space-y-2">
            {weakest.map((entry) => (
              <Link
                key={entry.slug}
                href={`/v2/models/${entry.slug}`}
                className="block rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100"
              >
                <span className="font-semibold">{entry.name}</span> · {entry.vendor} · {formatPercent(entry.ratio, 1)}
                {entry.missing?.length ? ` · Missing: ${entry.missing.join(", ")}` : ""}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
