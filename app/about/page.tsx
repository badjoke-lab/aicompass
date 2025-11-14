export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
        About AI Compass
      </h1>
      <p className="text-sm text-slate-400">
        AI Compass is a BadJoke-Lab project that scores modern AI models with a
        focus on transparency and reproducibility. It is not sponsored by any
        vendor.
      </p>
      <p className="text-sm text-slate-400">
        The goal is to provide a simple, data-first overview of how models
        compare, how they change over time, and where the underlying evidence
        comes from.
      </p>
    </div>
  );
}
