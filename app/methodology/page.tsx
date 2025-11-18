import { DELTA_WINDOW_DAYS } from "@/lib/models";

export default function MethodologyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
        Methodology
      </h1>
      <p className="text-sm text-slate-400">
        The aims-v1 methodology is intentionally simple. Each number on the
        scoreboard must come from a cited artifact that is public, repeatable,
        and updated frequently enough to matter.
      </p>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">Scoring philosophy</h2>
        <p className="text-sm text-slate-400">
          Four pillars drive the composite score: Performance (40%), Safety &
          Alignment (30%), Cost & Efficiency (10%), and Transparency & Ecosystem
          (20%). Each pillar is normalized to 0–100 with sub-metrics documented in
          the evidence drawer of every model card. We err on the side of
          conservative scoring—if two reputable sources disagree, the lower
          number wins until the delta stabilizes.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">30-day delta rules</h2>
        <p className="text-sm text-slate-400">
          Movement is tracked in rolling {" "}
          {DELTA_WINDOW_DAYS}-day windows. A change only posts to the board when
          at least two corroborating datapoints exist (e.g. a vendor changelog
          plus third-party eval). Spikes appear when |Δ| ≥ 3. If a vendor stops
          publishing updates for more than 45 days, the model is frozen and
          flagged for review.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">Transparency requirements</h2>
        <p className="text-sm text-slate-400">
          No private benchmarks, no unverifiable leaks. Each row in the
          scoreboard links back to eval reports, policy notes, pricing pages, or
          shipping announcements. Models without public documentation stay in a
          &ldquo;waiting&rdquo; state and do not impact spike calculations until the minimum
          disclosure set is satisfied.
        </p>
      </div>
    </div>
  );
}
