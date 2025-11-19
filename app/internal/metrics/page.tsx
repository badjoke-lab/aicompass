import { DELTA_WINDOW_DAYS } from "@/lib/models";
import { v2ScoreEngine } from "@/lib/v2";

const snapshots = v2ScoreEngine.getSnapshots();

export const metadata = {
  title: "Internal metrics · AI Model Scoreboard"
};

export default function InternalMetricsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          aims-v2 internal
        </p>
        <h1 className="text-3xl font-semibold text-slate-50">Advanced metrics console</h1>
        <p className="text-sm text-slate-400">
          Private diagnostics for the upcoming aims-v2 score engine. Values combine volatility, transparency compliance,
          weighted deltas, and other derived indicators while leaving the public leaderboard untouched.
        </p>
        <p className="text-xs uppercase tracking-widest text-slate-500">Desktop only</p>
        <p className="text-sm text-slate-500 lg:hidden">
          This diagnostic table only renders on larger viewports (≥1024px). Please reopen from a desktop screen to review
          volatility, compliance, and weighted deltas.
        </p>
      </section>

      <div className="hidden overflow-x-auto rounded-3xl border border-slate-800 bg-surface/80 shadow-lg lg:block">
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
            {snapshots.map(({ model, metrics }) => (
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
    </div>
  );
}
