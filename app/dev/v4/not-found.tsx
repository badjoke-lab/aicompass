export default function V4NotFound() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-background/70 p-6 text-center text-slate-200">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v4 dev</p>
      <h1 className="text-2xl font-semibold text-slate-50">Model not found</h1>
      <p className="text-sm text-slate-400">This v4 prototype could not find the requested model entry.</p>
      <a className="text-accent underline-offset-4 hover:underline" href="/dev/v4">
        Return to the v4 dev leaderboard
      </a>
    </div>
  );
}
