import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AIMS v4 · Prototype",
  description: "Isolated v4 prototype views with mock leaderboard data.",
};

export default function V4Layout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-background text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-12">
        <header className="flex items-center justify-between rounded-xl border border-slate-800 bg-background/60 px-4 py-3 text-sm text-slate-300">
          <div className="font-semibold tracking-[0.2em] text-slate-100">AIMS · v4 preview</div>
          <nav className="flex items-center gap-3 text-xs uppercase tracking-wide text-accent">
            <Link className="underline-offset-4 hover:underline" href="/">
              v3 home
            </Link>
            <span className="text-slate-600">/</span>
            <Link className="underline-offset-4 hover:underline" href="/v4">
              v4 leaderboard
            </Link>
          </nav>
        </header>

        {children}

        <footer className="border-t border-slate-800 pt-4 text-xs text-slate-500">
          Mock data only · Does not impact AIMS v3 or production metrics.
        </footer>
      </div>
    </section>
  );
}
