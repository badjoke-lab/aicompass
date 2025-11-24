export default function LoadingSupportPage() {
  return (
    <div className="space-y-6 animate-pulse">
      <header className="space-y-3">
        <div className="h-3 w-24 rounded-full bg-slate-800" />
        <div className="h-8 w-3/4 rounded-lg bg-slate-800" />
        <div className="h-4 w-full max-w-3xl rounded bg-slate-800" />
      </header>

      <div className="space-y-5 text-sm leading-relaxed text-slate-400">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-slate-800" />
          <div className="space-y-2 pl-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-3 w-full max-w-xl rounded bg-slate-800" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-3/4 max-w-2xl rounded bg-slate-800" />
          <div className="h-3 w-2/3 max-w-xl rounded bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
