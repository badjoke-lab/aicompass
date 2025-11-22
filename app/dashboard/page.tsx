import { MetricTile } from "@/components/v2/MetricTile";
import { RatioBar } from "@/components/v2/RatioBar";
import { SectionCard } from "@/components/v2/SectionCard";
import { V2_DELTA_WINDOW_DAYS, getInternalDashboardData } from "@/lib/v2";

const dashboard = getInternalDashboardData();

export const metadata = {
  title: "AIMS v2 · Dashboard"
};

export default function DashboardPage() {
  const { summary } = dashboard;

  return (
    <div className="flex flex-col gap-10">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2</p>
        <h1 className="text-3xl font-semibold text-slate-50">Operational dashboard</h1>
        <p className="max-w-4xl text-sm text-slate-400">
          Single source of truth for all public surfaces. Everything below is rendered solely from v2 helpers and metrics,
          including anomaly detection, completeness tracking, and velocity signals.
        </p>
      </section>

      <SectionCard
        title="Health overview"
        description={`Δ window ${V2_DELTA_WINDOW_DAYS} days · ${summary.tracked} tracked models`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            label="Global health"
            value={`${summary.globalHealthScore}`}
            helper="Composite weighting for metadata, evidence, transparency, stability"
          />
          <MetricTile
            label="Average health"
            value={`${summary.avgHealthScore}`}
            helper="Mean score across all models"
          />
          <MetricTile
            label="Coverage"
            value={`${summary.coveragePercent}%`}
            helper={`Active ${summary.active} · waiting ${summary.waiting}`}
          />
          <MetricTile
            label="Median transparency"
            value={`${summary.medianTransparency.toFixed(1)}%`}
            helper="Ratio of transparency vs disclosure expectations"
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Metadata coverage" description="Field-level completion across all tracked models">
          <div className="space-y-3">
            {dashboard.metadata.coverage.map((field) => (
              <RatioBar
                key={field.key}
                label={`${field.label} · ${field.coveragePercent}%`}
                ratio={field.coveragePercent / 100}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Evidence coverage" description="Signals present per bucket">
          <div className="space-y-3">
            {dashboard.evidence.coverage.map((bucket) => (
              <div key={bucket.key} className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{bucket.label}</span>
                  <span className="font-mono text-slate-400">{bucket.count.toFixed(1)} avg</span>
                </div>
                <RatioBar label="Completeness" ratio={bucket.completeness / 100} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Spikes & transparency"
        description={`Δ window ${V2_DELTA_WINDOW_DAYS}d spike detection and transparency checks`}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <AnomalyList title="Spike gainers" items={dashboard.anomalies.gainers.map(toAnomalyRow)} />
          <AnomalyList title="Spike droppers" items={dashboard.anomalies.droppers.map(toAnomalyRow)} />
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-slate-50">Transparency alerts</p>
            <ul className="space-y-2 text-sm text-slate-300">
              {dashboard.anomalies.transparency.length === 0 ? (
                <li className="text-slate-500">No ratios under threshold</li>
              ) : (
                dashboard.anomalies.transparency.map((alert) => (
                  <li key={alert.slug} className="rounded-lg bg-slate-900/80 px-3 py-2">
                    <div className="font-semibold text-slate-50">{alert.name}</div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{alert.vendor}</div>
                    <div className="text-sm text-amber-300">Ratio {alert.ratio.toFixed(2)}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Velocity watch" description="Negative weekly velocity signals">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dashboard.trendWatch.map((entry) => (
            <div key={entry.slug} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{entry.vendor}</p>
              <p className="text-lg font-semibold text-slate-50">{entry.name}</p>
              <p className="text-sm text-slate-400">Velocity {entry.velocity.toFixed(2)} /wk</p>
              <p className="text-xs text-slate-500">Δ {entry.delta.toFixed(2)} · {entry.history?.length ?? 0} history points</p>
              <p className="text-xs capitalize text-slate-500">Volatility {entry.volatilityBucket}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function toAnomalyRow(alert: { slug: string; name: string; vendor: string; deltaLabel: string; total: number }) {
  return {
    ...alert,
    delta: alert.deltaLabel,
    total: alert.total.toFixed(1)
  };
}

function AnomalyList({
  title,
  items
}: {
  title: string;
  items: Array<{ slug: string; name: string; vendor: string; delta: string; total: string }>;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-sm font-semibold text-slate-50">{title}</p>
      <ul className="space-y-2 text-sm text-slate-300">
        {items.length === 0 ? (
          <li className="text-slate-500">None detected</li>
        ) : (
          items.map((item) => (
            <li key={item.slug} className="rounded-lg bg-slate-950/80 px-3 py-2">
              <div className="font-semibold text-slate-50">{item.name}</div>
              <div className="text-xs uppercase tracking-wide text-slate-500">{item.vendor}</div>
              <div className="text-xs text-slate-400">Δ {item.delta}</div>
              <div className="text-xs text-slate-500">Total {item.total}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
