export default function Loading() {
  return (
    <div className="space-y-10 animate-pulse min-h-screen">
      <header className="space-y-4 sm:space-y-5">
        <div className="h-3 w-24 rounded-full bg-slate-800" />
        <div className="space-y-2">
          <div className="h-8 w-2/3 rounded-lg bg-slate-800" />
          <div className="h-4 w-full max-w-2xl rounded-lg bg-slate-800" />
          <div className="h-4 w-5/6 max-w-xl rounded-lg bg-slate-800" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-3 w-48 rounded-full bg-slate-800" />
          <div className="h-8 w-40 rounded-full bg-slate-800" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-8 w-40 rounded-full bg-slate-800" />
          ))}
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-800 bg-background/50 px-4 py-3"
          >
            <div className="h-3 w-24 rounded-full bg-slate-800" />
            <div className="mt-3 h-6 w-16 rounded-lg bg-slate-800" />
            <div className="mt-2 h-3 w-20 rounded-full bg-slate-800" />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-surface/80 shadow-xl min-h-[420px]">
        <div className="border-b border-slate-800 px-4 py-3 sm:px-6">
          <div className="h-4 w-28 rounded bg-slate-800" />
          <div className="mt-2 h-3 w-52 rounded bg-slate-800" />
        </div>
        <div className="space-y-3 p-4 sm:p-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-[92px] flex-col gap-2 rounded-xl border border-slate-800/60 bg-background/50 p-3 sm:min-h-[76px] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-slate-800" />
                <div className="h-3 w-32 rounded bg-slate-800" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, pill) => (
                  <div key={pill} className="h-3 w-12 rounded-full bg-slate-800" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
