export default function LoadingMethodologyPage() {
  return (
    <div className="space-y-6 animate-pulse">
      <header className="space-y-3">
        <div className="h-3 w-28 rounded-full bg-slate-800" />
        <div className="h-8 w-3/4 rounded-lg bg-slate-800" />
        <div className="h-4 w-full max-w-3xl rounded bg-slate-800" />
        <div className="h-4 w-5/6 max-w-2xl rounded bg-slate-800" />
      </header>

      {Array.from({ length: 3 }).map((_, index) => (
        <section
          key={index}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-slate-800" />
              <div className="h-3 w-48 rounded bg-slate-800" />
            </div>
            <div className="h-7 w-24 rounded-full bg-slate-800" />
          </div>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="h-3 w-full max-w-3xl rounded bg-slate-800" />
            <div className="h-3 w-5/6 max-w-2xl rounded bg-slate-800" />
            <div className="h-3 w-4/6 max-w-xl rounded bg-slate-800" />
          </div>
        </section>
      ))}
    </div>
  );
}
