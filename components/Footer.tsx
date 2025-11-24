import Link from "next/link";

import { shellClass } from "@/lib/layout";
import HealthIndicator from "./HealthIndicator";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-background/80">
      <div
        className={`${shellClass} flex flex-col gap-3 py-5 text-[0.85rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-1 leading-tight text-slate-400">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">AI Model Scoreboard</div>
          <div>© {new Date().getFullYear()} · Evidence-first · Open metrics · Community supported</div>
        </div>
        <div className="flex flex-col gap-2 text-right sm:items-end">
          <nav
            aria-label="Secondary navigation"
            className="flex flex-wrap items-center justify-end gap-3 text-slate-400"
          >
            <Link className="text-slate-300 underline-offset-4 hover:text-accent" href="/support">
              Support
            </Link>
            <Link className="text-slate-300 underline-offset-4 hover:text-accent" href="/donation">
              Donate
            </Link>
            <Link className="text-slate-300 underline-offset-4 hover:text-accent" href="/docs/changelog">
              Changelog
            </Link>
            <HealthIndicator />
          </nav>
          <p className="text-[0.75rem] leading-relaxed text-slate-600">
            Data is aggregated from public sources; please verify before making critical decisions.
          </p>
          <p className="text-[0.75rem] leading-relaxed text-slate-600">
            AI Model Scoreboard is informational only and does not provide investment, compliance, or security advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
