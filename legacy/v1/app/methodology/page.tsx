import { DELTA_WINDOW_DAYS } from "@/lib/models";

const scoringCategories = [
  {
    name: "Performance",
    description: "Reference benchmarks, agent evals, and multi-turn reasoning checks weighted by recency.",
  },
  {
    name: "Safety & Alignment",
    description: "Red-teaming data, mitigation disclosures, and public policy updates covering misuse management.",
  },
  {
    name: "Cost & Efficiency",
    description: "Token pricing, throughput disclosures, and hardware efficiency relative to peers.",
  },
  {
    name: "Reliability",
    description: "Uptime reports, incident reviews, and deterministic behavior guarantees.",
  },
  {
    name: "Transparency",
    description: "Depth of documentation, eval reproducibility, and openness of release notes.",
  },
  {
    name: "Ecosystem",
    description: "Tooling support, SDK maturity, and independent integrations across industries.",
  },
  {
    name: "Adoption",
    description: "Signals from real deployments, revenue disclosures, and community references.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
        Methodology
      </h1>
      <p className="text-sm text-slate-400">
        aims-v1 is built for operators who care about primary evidence. Every
        score on the board must link back to something the public can inspect:
        lab reports, policy write-ups, shipping notes, or pricing updates.
      </p>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">Evidence-first principle</h2>
        <p className="text-sm text-slate-400">
          We apply a &ldquo;trust but verify&rdquo; rule. Hearsay, investor decks, and
          anonymous leaks never move the scoreboard. When conflicting artifacts
          exist, we publish the lower score until the delta is resolved with
          additional public proof. That bias toward conservatism keeps the
          leaderboard useful for procurement and policy teams.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">Seven scoring categories</h2>
        <p className="text-sm text-slate-400">
          Each model receives normalized 0–100 scores across seven categories.
          They roll up into the composite total you see on the leaderboard.
        </p>
        <ul className="space-y-2 text-sm text-slate-300">
          {scoringCategories.map((category) => (
            <li key={category.name}>
              <span className="font-semibold text-slate-50">{category.name}:</span> {category.description}
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500">
          Categories are updated quarterly. Historical values remain archived in
          the evidence drawer of each model card.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">{DELTA_WINDOW_DAYS}-day delta rule</h2>
        <p className="text-sm text-slate-400">
          Movement is tracked in rolling {DELTA_WINDOW_DAYS}-day windows. A score
          change only posts once two corroborating datapoints exist (for example,
          a vendor changelog plus an independent eval). Spikes appear when the
          absolute delta is ≥ 3. If a vendor goes dark for 45+ days we freeze the
          row, mark it as waiting, and investigate.
        </p>
        <p className="text-xs text-slate-500">
          This prevents marketing swings from overwhelming the feed and keeps the
          board in sync with real deployment milestones.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-base font-semibold text-slate-100">Transparency requirements</h2>
        <p className="text-sm text-slate-400">
          No private benchmarks, no unverifiable leaks. Every claim links back to
          a public artifact and includes enough metadata for others to reproduce
          the measurement.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>Models missing public docs remain in a &ldquo;waiting&rdquo; state.</li>
          <li>Pricing and policy updates must be dated and attributed.</li>
          <li>Eval notebooks/scripts are archived for anyone to rerun.</li>
          <li>Major incidents stay on the record until remediation is public.</li>
        </ul>
        <p className="text-xs text-slate-500">
          If transparency slips, the model is removed from spike calculations and
          flagged for additional review.
        </p>
      </div>
    </div>
  );
}
