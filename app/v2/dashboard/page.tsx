import { RatioBar } from "@/components/v2/RatioBar";
import { SectionCard } from "@/components/v2/SectionCard";
import { getInternalDashboardData, TRANSPARENCY_ALERT_THRESHOLD } from "@/lib/v2";

const dashboard = getInternalDashboardData();

export const metadata = {
  title: "AIMS v2 · Internal dashboard"
};

export default function V2DashboardPage() {
  const { summary, anomalies, trendLeaders, trendWatch, metadata, evidence, modelHealth } = dashboard;
  const volatilityTotal = Object.values(summary.volatilityMix).reduce((total, count) => total + count, 0);
  const topHealth = [...modelHealth].sort((a, b) => b.healthScore - a.healthScore).slice(0, 8);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2 internal</p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-50">Diagnostics dashboard</h1>
          <p className="text-sm text-slate-400">
            Server-rendered view sourced exclusively from v2 data helpers. Uses cached calculations from the v2 score engine
            and dashboard builder without touching any public v1 surfaces.
          </p>
        </div>
        <p className="text-xs text-slate-500">Generated at {new Date(summary.generatedAt).toLocaleString()}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricStat label="Global health" value={`${summary.globalHealthScore}`} helper="Composite integrity score" />
        <MetricStat
          label="Tracked"
          value={`${summary.tracked}`}
          helper={`Active ${summary.active} · Waiting ${summary.waiting}`}
        />
        <MetricStat
          label="Transparency median"
          value={`${summary.medianTransparency.toFixed(1)}%`}
          helper={`Watch below ${(TRANSPARENCY_ALERT_THRESHOLD * 100).toFixed(0)}%`}
        />
        <MetricStat
          label="Completeness"
          value={`${summary.metadataAverage.toFixed(1)}% / ${summary.evidenceAverage.toFixed(1)}%`}
          helper="Metadata vs evidence coverage"
        />
      </div>

      <SectionCard
        title="Volatility mix"
        description="Distribution of volatility buckets derived from v2 history statistics"
        action={<span className="text-xs text-slate-400">{volatilityTotal} total models</span>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {Object.entries(summary.volatilityMix).map(([bucket, count]) => (
            <RatioBar key={bucket} label={bucket} ratio={volatilityTotal ? count / volatilityTotal : 0} emphasis />
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <AlertCard
          title="Spike gainers"
          helper="Δ window movers ≥ +3"
          items={anomalies.gainers.map((entry) => ({
            slug: entry.slug,
            name: entry.name,
            vendor: entry.vendor,
            primary: `${entry.deltaLabel}`,
            secondary: `${entry.total.toFixed(1)} total`
          }))}
        />
        <AlertCard
          title="Spike droppers"
          helper="Δ window movers ≤ -3"
          items={anomalies.droppers.map((entry) => ({
            slug: entry.slug,
            name: entry.name,
            vendor: entry.vendor,
            primary: `${entry.deltaLabel}`,
            secondary: `${entry.total.toFixed(1)} total`
          }))}
        />
        <AlertCard
          title="Transparency watch"
          helper={`Ratio below ${(TRANSPARENCY_ALERT_THRESHOLD * 100).toFixed(0)}%`}
          items={anomalies.transparency.map((entry) => ({
            slug: entry.slug,
            name: entry.name,
            vendor: entry.vendor,
            primary: `${(entry.ratio * 100).toFixed(1)}%`,
            secondary: `score ${entry.transparencyScore.toFixed(1)} / disclosure ${entry.disclosureScore.toFixed(1)}`
          }))}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Trend leaders"
          description="Positive velocity models across the default v2 window"
        >
          <TrendList entries={trendLeaders} tone="positive" />
        </SectionCard>
        <SectionCard
          title="Trend watchlist"
          description="Negative velocity models worth monitoring"
        >
          <TrendList entries={trendWatch} tone="negative" />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Metadata completeness"
          description="Field coverage across vendor, release, modality, and disclosures"
          action={<span className="text-xs text-slate-400">Avg {metadata.averageRatio.toFixed(2)} ratio</span>}
        >
          <CoverageList
            coverage={metadata.coverage.map((entry) => ({ label: entry.label, value: entry.coveragePercent / 100 }))}
            strongest={metadata.strongest.map((entry) => ({
              slug: entry.slug,
              name: entry.name,
              vendor: entry.vendor,
              value: entry.ratio / 100
            }))}
            weakest={metadata.weakest.map((entry) => ({
              slug: entry.slug,
              name: entry.name,
              vendor: entry.vendor,
              value: entry.ratio / 100
            }))}
          />
        </SectionCard>
        <SectionCard
          title="Evidence completeness"
          description="Signals across pricing, benchmarks, safety, and technical disclosures"
          action={<span className="text-xs text-slate-400">Avg {evidence.averageRatio.toFixed(2)} ratio</span>}
        >
          <CoverageList
            coverage={evidence.coverage.map((entry) => ({ label: entry.label, value: entry.completeness / 100 }))}
            weakest={evidence.weakest.map((entry) => ({
              slug: entry.slug,
              name: entry.name,
              vendor: entry.vendor,
              value: entry.ratio / 100
            }))}
          />
        </SectionCard>
      </div>

      <SectionCard
        title="Health table"
        description="Composite health = metadata (32%) + evidence (20%) + transparency (20%) + stability (15%) + velocity & weighted delta (13%)"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Model</th>
                <th className="px-3 py-3">Health</th>
                <th className="px-3 py-3">Metadata</th>
                <th className="px-3 py-3">Evidence</th>
                <th className="px-3 py-3">Transparency</th>
                <th className="px-3 py-3">Velocity</th>
                <th className="px-3 py-3">Weighted Δ</th>
                <th className="px-3 py-3">Volatility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {topHealth.map((row) => (
                <tr key={row.slug} className="bg-slate-950/30">
                  <td className="px-3 py-3">
                    <div className="font-semibold text-slate-50">{row.name}</div>
                    <div className="text-xs text-slate-500">{row.vendor}</div>
                    <div className="text-[0.7rem] text-slate-500">Total {row.total.toFixed(1)}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-xl font-semibold text-slate-50">{row.healthScore}</div>
                    <div className="text-xs text-slate-500">{row.spikeDirection ?? "steady"}</div>
                    {row.transparencyViolation ? (
                      <div className="text-[0.7rem] text-amber-400">Transparency watch</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <RatioBar label="metadata" ratio={row.metadata.ratio} />
                  </td>
                  <td className="px-3 py-3">
                    <RatioBar label="evidence" ratio={row.evidence.ratio} />
                  </td>
                  <td className="px-3 py-3">
                    <RatioBar label="compliance" ratio={row.transparencyRatio} emphasis />
                  </td>
                  <td className="px-3 py-3">
                    <div className={row.trendVelocity.velocity >= 0 ? "text-positive" : "text-negative"}>
                      {row.trendVelocity.velocity.toFixed(2)} /wk
                    </div>
                    <div className="text-[0.7rem] text-slate-500">Δ {row.trendVelocity.delta.toFixed(1)}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-mono text-slate-50">{row.weightedDelta.toFixed(2)}</div>
                    <div className="text-[0.7rem] text-slate-500">windowed Δ</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="capitalize">{row.volatilityBucket}</div>
                    <div className="text-[0.7rem] text-slate-500">index {row.volatilityIndex.toFixed(2)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function MetricStat({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner">
      <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
      {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
    </article>
  );
}

function AlertCard({
  title,
  helper,
  items
}: {
  title: string;
  helper?: string;
  items: Array<{ slug: string; name: string; vendor: string; primary: string; secondary?: string }>;
}) {
  return (
    <SectionCard
      title={title}
      description={helper}
      action={<span className="text-xs text-slate-400">{items.length} entries</span>}
    >
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No alerts.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.slug} className="flex items-center justify-between rounded-xl border border-slate-800/80 px-3 py-2">
              <div>
                <div className="font-semibold text-slate-100">{item.name}</div>
                <p className="text-xs text-slate-500">{item.vendor}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-slate-50">{item.primary}</p>
                {item.secondary ? <p className="text-xs text-slate-500">{item.secondary}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

function TrendList({
  entries,
  tone
}: {
  entries: typeof dashboard.trendLeaders;
  tone: "positive" | "negative";
}) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-500">No signals detected.</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.slug} className="flex items-center justify-between rounded-2xl border border-slate-800 px-4 py-3">
          <div>
            <div className="font-semibold text-slate-50">{entry.name}</div>
            <p className="text-xs text-slate-500">{entry.vendor}</p>
          </div>
          <div className="text-right">
            <p className={tone === "positive" ? "text-positive" : "text-negative"}>
              {entry.velocity.toFixed(2)} /wk
            </p>
            <p className="text-[0.7rem] text-slate-500">Δ {entry.delta.toFixed(1)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoverageList({
  coverage,
  strongest = [],
  weakest = []
}: {
  coverage: Array<{ label: string; value: number }>;
  strongest?: Array<{ slug: string; name: string; vendor: string; value: number }>;
  weakest?: Array<{ slug: string; name: string; vendor: string; value: number }>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {coverage.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3">
            <RatioBar label={item.label} ratio={item.value} />
          </div>
        ))}
      </div>
      {strongest.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Strongest</p>
          <div className="space-y-2">
            {strongest.map((entry) => (
              <CoverageRow key={entry.slug} label={entry.name} vendor={entry.vendor} ratio={entry.value} />
            ))}
          </div>
        </div>
      ) : null}
      {weakest.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Weakest</p>
          <div className="space-y-2">
            {weakest.map((entry) => (
              <CoverageRow key={entry.slug} label={entry.name} vendor={entry.vendor} ratio={entry.value} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CoverageRow({ label, vendor, ratio }: { label: string; vendor: string; ratio: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 px-3 py-2">
      <div>
        <p className="font-semibold text-slate-100">{label}</p>
        <p className="text-[0.7rem] text-slate-500">{vendor}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono text-slate-50">{(ratio * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}
