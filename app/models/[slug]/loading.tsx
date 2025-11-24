export default function LoadingModelPage() {
  return (
    <div className="space-y-8 animate-pulse">
      <header className="space-y-3 sm:space-y-4">
        <div className="h-3 w-24 rounded-full bg-slate-800" />
        <div className="space-y-2">
          <div className="h-8 w-2/3 rounded-lg bg-slate-800" />
          <div className="h-4 w-1/2 rounded bg-slate-800" />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span className="h-8 w-40 rounded-full bg-slate-800" />
          <span className="h-8 w-40 rounded-full bg-slate-800" />
          <span className="h-4 w-48 rounded bg-slate-800" />
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-800 bg-background/50 px-4 py-3">
            <div className="h-3 w-24 rounded-full bg-slate-800" />
            <div className="mt-3 h-6 w-20 rounded-lg bg-slate-800" />
            <div className="mt-2 h-3 w-24 rounded-full bg-slate-800" />
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-800 bg-surface/80 p-4 shadow-xl sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="h-4 w-32 rounded bg-slate-800" />
            <div className="h-3 w-64 rounded bg-slate-800" />
          </div>
          <div className="h-8 w-32 rounded-full bg-slate-800" />
        </div>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="h-3 w-full max-w-4xl rounded bg-slate-800" />
          <div className="h-3 w-5/6 max-w-3xl rounded bg-slate-800" />
          <div className="h-3 w-2/3 max-w-2xl rounded bg-slate-800" />
        </div>
      </section>
    </div>
  );
}
