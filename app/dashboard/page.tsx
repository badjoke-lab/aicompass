import HistorySparkline from "@/components/HistorySparkline";
import { DELTA_WINDOW_DAYS } from "@/lib/models";
import {
  TRANSPARENCY_ALERT_THRESHOLD,
  getInternalDashboardData,
  type SpikeAlert,
  type TransparencyAlert,
  type TrendLeader
} from "@/lib/v2";

const dashboard = getInternalDashboardData();

export const metadata = {
  title: "Internal dashboard · AI Model Scoreboard"
};

export default function InternalDashboardPage() {
  const summaryCards = [
    {
      label: "Global health score",
      value: `${dashboard.summary.globalHealthScore}`,
      suffix: "/100",
      helper: "Composite metadata, evidence, transparency, volatility"
    },
    {
      label: "Tracked models",
      value: `${dashboard.summary.tracked}`,
      suffix: ` active ${dashboard.summary.active} · waiting ${dashboard.summary.waiting}`,
      helper: `Coverage ${dashboard.summary.coveragePercent}%`
    },
    {
      label: "Median transparency ratio",
      value: `${dashboard.summary.medianTransparency.toFixed(1)}%`,
      helper: "Ratio of transparency score vs disclosure expectation"
    },
    {
      label: "Metadata vs evidence",
      value: `${dashboard.summary.metadataAverage.toFixed(1)}% / ${dashboard.summary.evidenceAverage.toFixed(1)}%`,
      helper: "Average completeness"
    }
  ];

  const volatilityMix = dashboard.summary.volatilityMix;
  const bucketColors: Record<string, string> = {
    stable: "bg-emerald-400",
    mixed: "bg-amber-300",
    volatile: "bg-rose-400"
  };
  const healthRows = [...dashboard.modelHealth].sort((a, b) => b.healthScore - a.healthScore);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims-v2 internal</p>
        <h1 className="text-3xl font-semibold text-slate-50">Integrated diagnostics dashboard</h1>
        <p className="max-w-4xl text-sm text-slate-400">
          Unified internal-only cockpit combining aims-v2 metrics, anomaly detection, completeness tracking, and velocity
          signals. All computations reuse deterministic v2 helpers without touching the public aims-v1 surface.
        </p>
        <p className="text-xs uppercase tracking-widest text-slate-500">Desktop only</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-800 bg-surface/80 p-4">
            <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">
              {card.value}
              {card.suffix ? <span className="text-base text-slate-500"> {card.suffix}</span> : null}
            </p>
            <p className="mt-2 text-xs text-slate-500">{card.helper}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-surface/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Volatility mix</p>
            <h2 className="text-xl font-semibold text-slate-100">{Object.values(volatilityMix).reduce((a, b) => a + b, 0)} models</h2>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            {Object.entries(volatilityMix).map(([bucket, count]) => (
              <span
                key={bucket}
                className="inline-flex items-center rounded-full border border-slate-700/80 px-3 py-1 text-slate-300"
              >
                <span className={`mr-2 h-2 w-2 rounded-full ${bucketColors[bucket] ?? "bg-blue-400"}`} />
                {bucket} · {count}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <AnomalyCard title="Spike gainers" description={`Δ${DELTA_WINDOW_DAYS}d movers ≥ +3`} data={dashboard.anomalies.gainers} />
        <AnomalyCard title="Spike droppers" description={`Δ${DELTA_WINDOW_DAYS}d movers ≤ -3`} data={dashboard.anomalies.droppers} />
        <TransparencyCard alerts={dashboard.anomalies.transparency} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <CompletenessCard
          title="Metadata completeness"
          average={dashboard.summary.metadataAverage}
          coverage={dashboard.metadata.coverage}
          strongest={dashboard.metadata.strongest}
          weakest={dashboard.metadata.weakest}
          helper="Vendor, release, modality, scale, and disclosure requirements"
        />
        <EvidenceCard
          average={dashboard.summary.evidenceAverage}
          coverage={dashboard.evidence.coverage}
          weakest={dashboard.evidence.weakest}
        />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Health table</p>
          <h2 className="text-2xl font-semibold text-slate-50">Model integrity monitor</h2>
          <p className="text-sm text-slate-400">
            Composite health = metadata (32%) + evidence (20%) + transparency (20%) + stability (15%) + velocity & weighted
            delta (13%).
          </p>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-surface/80">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Model</th>
                <th className="px-4 py-3 font-semibold">Health</th>
                <th className="px-4 py-3 font-semibold">Metadata</th>
                <th className="px-4 py-3 font-semibold">Evidence</th>
                <th className="px-4 py-3 font-semibold">Transparency</th>
                <th className="px-4 py-3 font-semibold">Velocity</th>
                <th className="px-4 py-3 font-semibold">Δ{DELTA_WINDOW_DAYS}d weighted</th>
                <th className="px-4 py-3 font-semibold">Volatility</th>
              </tr>
            </thead>
            <tbody>
              {healthRows.map((row) => (
                <tr key={row.slug} className="border-t border-slate-800/70">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-50">{row.name}</div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{row.vendor}</div>
                    <div className="text-[0.7rem] text-slate-500">Total {row.total.toFixed(1)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xl font-semibold text-slate-50">{row.healthScore}</div>
                    <p className="text-xs text-slate-500">{row.spikeDirection ? `Spike ${row.spikeDirection}` : "Normal"}</p>
                    {row.transparencyViolation ? (
                      <p className="text-xs text-amber-400">Transparency watch</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <PercentBar
                      value={row.metadata.ratio * 100}
                      label={`${row.metadata.present.length}/${row.metadata.present.length + row.metadata.missing.length} fields`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <PercentBar value={row.evidence.ratio * 100} label={`${row.evidence.signals} signals`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-lg font-semibold text-slate-50">{(row.transparencyRatio * 100).toFixed(0)}%</div>
                    <p className="text-xs text-slate-500">ratio vs disclosure</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-lg font-semibold text-slate-50">{row.trendVelocity.velocity.toFixed(2)}/wk</div>
                    <p className="text-xs text-slate-500">Δ{row.trendVelocity.delta.toFixed(2)} over {row.trendVelocity.sampleCount} pts</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-lg font-semibold text-slate-50">{row.weightedDelta.toFixed(2)}</div>
                    <p className="text-xs text-slate-500">Momentum weighted delta</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{row.volatilityBucket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TrendPanel title="Velocity leaders" description="> +0.25 per week" data={dashboard.trendLeaders} />
        <TrendPanel title="Velocity watch" description="< -0.2 per week" data={dashboard.trendWatch} />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">V2 metrics</p>
          <h2 className="text-2xl font-semibold text-slate-50">Snapshot table</h2>
          <p className="text-sm text-slate-400">
            Mirrors the dedicated metrics console but anchored here for cross-reference with internal health signals.
          </p>
        </div>
        <div className="hidden overflow-x-auto rounded-3xl border border-slate-800 bg-surface/80 shadow-lg xl:block">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4 font-semibold">Model</th>
                <th className="px-5 py-4 font-semibold">Volatility index</th>
                <th className="px-5 py-4 font-semibold">Transparency compliance</th>
                <th className="px-5 py-4 font-semibold">Trend velocity</th>
                <th className="px-5 py-4 font-semibold">Ecosystem depth</th>
                <th className="px-5 py-4 font-semibold">Weighted Δ{DELTA_WINDOW_DAYS}d</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.metrics.map(({ model, metrics }) => (
                <tr key={model.slug} className="border-t border-slate-800/70">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-50">{model.name}</div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{metrics.vendor}</div>
                    <div className="text-[0.7rem] text-slate-500">Total {model.total.toFixed(1)}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-lg font-semibold text-slate-50">{metrics.volatilityIndex.toFixed(2)}</div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{metrics.volatilityBucket}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-lg font-semibold text-slate-50">{(metrics.transparencyCompliance.ratio * 100).toFixed(0)}%</div>
                    <div className="text-xs text-slate-500">
                      Disclosure score {metrics.transparencyCompliance.disclosureScore.toFixed(1)} · transparency {metrics.transparencyCompliance.transparencyScore}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-lg font-semibold text-slate-50">{metrics.trendVelocity.velocity.toFixed(2)} / wk</div>
                    <div className="text-xs text-slate-500">Δ{metrics.trendVelocity.delta.toFixed(2)} over {metrics.trendVelocity.sampleCount} pts</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-lg font-semibold text-slate-50">{metrics.ecosystemDepth.depth.toFixed(1)}</div>
                    <div className="text-xs text-slate-500">
                      +{metrics.ecosystemDepth.modalityBonus.toFixed(1)} modalities · +{metrics.ecosystemDepth.coverageBonus.toFixed(1)} evidence ({metrics.ecosystemDepth.evidenceSignals} signals)
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-lg font-semibold text-slate-50">{metrics.weightedDelta.value.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">
                      Raw {metrics.weightedDelta.rawDelta.toFixed(2)} · momentum {metrics.weightedDelta.momentumBoost.toFixed(2)} · stability {metrics.weightedDelta.stabilityPenalty.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 xl:hidden">
          Full metrics table available on ≥1280px viewports.
        </p>
      </section>
    </div>
  );
}

function AnomalyCard({ title, description, data }: { title: string; description: string; data: SpikeAlert[] }) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-surface/80 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <p className="text-sm text-slate-400">{description}</p>
      <ul className="mt-3 space-y-3 text-sm">
        {data.length === 0 ? <li className="text-xs text-slate-500">No alerts</li> : null}
        {data.map((item) => (
          <li key={item.slug} className="flex items-center justify-between rounded-2xl border border-slate-800/60 px-3 py-2">
            <div>
              <p className="font-semibold text-slate-50">{item.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{item.vendor}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-50">{item.deltaLabel}</p>
              <p className="text-xs text-slate-500">Total {item.total.toFixed(1)}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

function TransparencyCard({ alerts }: { alerts: TransparencyAlert[] }) {
  return (
    <article className="rounded-3xl border border-amber-900/60 bg-amber-950/20 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Transparency alerts</p>
      <p className="text-sm text-amber-200">Ratio &lt; {TRANSPARENCY_ALERT_THRESHOLD * 100}%</p>
      <ul className="mt-3 space-y-3 text-sm">
        {alerts.length === 0 ? <li className="text-xs text-amber-200">No violations</li> : null}
        {alerts.map((alert) => (
          <li key={alert.slug} className="flex items-center justify-between rounded-2xl border border-amber-800/50 px-3 py-2">
            <div>
              <p className="font-semibold text-amber-100">{alert.name}</p>
              <p className="text-xs uppercase tracking-wide text-amber-400">{alert.vendor}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-amber-100">{(alert.ratio * 100).toFixed(0)}%</p>
              <p className="text-[0.65rem] text-amber-300">T {alert.transparencyScore} · D {alert.disclosureScore.toFixed(1)}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CompletenessCard({
  title,
  average,
  coverage,
  strongest,
  weakest,
  helper
}: {
  title: string;
  average: number;
  coverage: { key: string; label: string; coveragePercent: number }[];
  strongest: { slug: string; name: string; vendor: string; ratio: number }[];
  weakest: { slug: string; name: string; vendor: string; ratio: number; missing: string[] }[];
  helper: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-surface/80 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <p className="text-3xl font-semibold text-slate-50">{average.toFixed(1)}%</p>
      <p className="text-sm text-slate-400">{helper}</p>
      <div className="mt-4 space-y-3">
        {coverage.map((field) => (
          <div key={field.key}>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{field.label}</span>
              <span>{field.coveragePercent}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-900">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: `${field.coveragePercent}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 text-sm lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Strongest</p>
          <ul className="mt-2 space-y-2">
            {strongest.map((entry) => (
              <li key={entry.slug} className="rounded-xl border border-slate-800/60 px-3 py-2">
                <p className="font-semibold text-slate-50">{entry.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{entry.vendor}</p>
                <p className="text-xs text-slate-400">{entry.ratio.toFixed(1)}%</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Gaps</p>
          <ul className="mt-2 space-y-2">
            {weakest.map((entry) => (
              <li key={entry.slug} className="rounded-xl border border-slate-800/60 px-3 py-2">
                <p className="font-semibold text-slate-50">{entry.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{entry.vendor}</p>
                <p className="text-xs text-slate-400">
                  {entry.ratio.toFixed(1)}% · Missing {entry.missing.length ? entry.missing.join(", ") : "—"}
                </p>
              </li>
            ))}
            {weakest.length === 0 ? <li className="text-xs text-slate-500">No gaps</li> : null}
          </ul>
        </div>
      </div>
    </article>
  );
}

function EvidenceCard({
  average,
  coverage,
  weakest
}: {
  average: number;
  coverage: { key: string; label: string; count: number; completeness: number }[];
  weakest: { slug: string; name: string; vendor: string; ratio: number; missingBuckets: string[] }[];
}) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-surface/80 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Evidence completeness</p>
      <p className="text-3xl font-semibold text-slate-50">{average.toFixed(1)}%</p>
      <p className="text-sm text-slate-400">Pricing, benchmarks, safety, technical, curated notes</p>
      <div className="mt-4 space-y-3">
        {coverage.map((bucket) => (
          <div key={bucket.key}>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{bucket.label}</span>
              <span>{bucket.completeness.toFixed(1)}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-900">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(bucket.completeness, 100)}%` }} />
            </div>
            <p className="mt-1 text-[0.65rem] text-slate-500">Avg docs {bucket.count.toFixed(1)}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Evidence backlog</p>
        <ul className="mt-2 space-y-2 text-sm">
          {weakest.map((entry) => (
            <li key={entry.slug} className="rounded-xl border border-slate-800/60 px-3 py-2">
              <p className="font-semibold text-slate-50">{entry.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{entry.vendor}</p>
              <p className="text-xs text-slate-400">
                {entry.ratio.toFixed(1)}% · Missing {entry.missingBuckets.length ? entry.missingBuckets.join(", ") : "—"}
              </p>
            </li>
          ))}
          {weakest.length === 0 ? <li className="text-xs text-slate-500">No backlog</li> : null}
        </ul>
      </div>
    </article>
  );
}

function PercentBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{value.toFixed(1)}%</span>
        <span>{label}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-slate-900">
        <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

function TrendPanel({ title, description, data }: { title: string; description: string; data: TrendLeader[] }) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-surface/80 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <p className="text-sm text-slate-400">{description}</p>
      <div className="mt-4 space-y-6">
        {data.length === 0 ? <p className="text-xs text-slate-500">No data</p> : null}
        {data.map((entry) => {
          const chartId = `${title}-${entry.slug}`.replace(/\s+/g, "-").toLowerCase();
          return (
            <div key={entry.slug} className="grid gap-3 lg:grid-cols-2">
              <div>
                <p className="text-lg font-semibold text-slate-50">{entry.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{entry.vendor}</p>
                <p className="text-sm text-slate-400">
                  {entry.velocity.toFixed(2)} / wk · Δ{entry.delta.toFixed(2)} · {entry.volatilityBucket}
                </p>
              </div>
              <HistorySparkline history={entry.history} chartId={chartId} />
            </div>
          );
        })}
      </div>
    </article>
  );
}
