import type { ReactNode } from 'react';

export const metadata = {
  title: 'AI Model Scoreboard v4',
  description: 'Isolated v4 scoreboard for AI models',
};

export default function V4Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-wide text-emerald-300">AI Model Scoreboard</p>
          <h1 className="text-3xl font-bold">Version 4 (isolated)</h1>
          <p className="text-slate-300 text-sm">
            Experimental rebuild of the leaderboard. Legacy routes stay unchanged.
          </p>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
