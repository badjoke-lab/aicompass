export default function LoadingDonationPage() {
  return (
    <div className="space-y-6 animate-pulse">
      <header className="space-y-3">
        <div className="h-3 w-24 rounded-full bg-slate-800" />
        <div className="h-8 w-3/4 rounded-lg bg-slate-800" />
        <div className="h-4 w-full max-w-3xl rounded bg-slate-800" />
      </header>

      <section className="space-y-3">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-accent/30 bg-slate-900/40 p-4">
              <div className="h-4 w-40 rounded bg-slate-800" />
              <div className="mt-2 h-3 w-full max-w-sm rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="h-4 w-40 rounded bg-slate-800" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <div className="h-4 w-16 rounded bg-slate-800" />
              <div className="h-3 w-full rounded bg-slate-800" />
              <div className="h-2.5 w-4/5 rounded bg-slate-900" />
            </div>
          ))}
        </div>
      </section>

      <div className="h-3 w-2/3 max-w-xl rounded bg-slate-800" />
    </div>
  );
}
