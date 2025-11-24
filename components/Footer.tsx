import HealthIndicator from "./HealthIndicator";

export default function Footer() {
  return (
    <footer aria-label="Site footer" className="border-t border-slate-800 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-[0.8rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-1 leading-tight">
          <div className="font-semibold text-slate-300">AI Model Scoreboard</div>
          <div>© {new Date().getFullYear()} · Evidence-first · Open metrics · Community supported</div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            aria-label="Donate or support AI Model Scoreboard"
            className="text-slate-300 underline-offset-4 hover:text-accent"
            href="#donate"
          >
            Donate / Support
          </a>
          <HealthIndicator />
        </div>
      </div>
    </footer>
  );
}
