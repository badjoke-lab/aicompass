export default function MethodologyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
        Methodology
      </h1>
      <p className="text-sm text-slate-400">
        This page will document how scores are calculated: metrics, weighting,
        normalization, and how evidence is used. For now, it&apos;s a
        placeholder derived from the spec.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
        <li>4 core metrics: Performance, Safety, Cost/Efficiency, Transparency</li>
        <li>Scores normalized to 0–100</li>
        <li>Weighted total score (40/30/10/20)</li>
        <li>Delta (Δ) over 30-day windows</li>
        <li>Spike badges for large movements</li>
        <li>Waiting state for models with limited public info</li>
      </ul>
    </div>
  );
}
