import HealthIndicator from "./HealthIndicator";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-[15px] py-[19px] text-[0.8rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-[22px] lg:px-[30px]">
        <div className="space-y-1 leading-tight">
          <div className="font-semibold text-slate-300">AI Model Scoreboard</div>
          <div>© {new Date().getFullYear()} · Evidence-first rankings · Independent, ad-free, and community funded.</div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a className="text-slate-300 underline-offset-4 hover:text-accent" href="#donate" aria-label="Skip to the donation section">
            Donate / Support
          </a>
          <HealthIndicator />
        </div>
      </div>
    </footer>
  );
}
