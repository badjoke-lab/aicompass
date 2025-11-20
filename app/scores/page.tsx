import V2LeaderboardTable from "@/components/V2LeaderboardTable";
import { v2ScoreEngine } from "@/lib/v2";

const snapshots = v2ScoreEngine.getSnapshots();
const ranked = [...snapshots].sort((a, b) => b.metrics.total - a.metrics.total);

export const metadata = {
  title: "Scores · AI Model Scoreboard",
  description:
    "Transparent AI model rankings powered by the aims-v2 engine. Track total scores, weighted deltas, transparency, and ecosystem signals.",
};

export default function ScoresPage() {
  const generatedAt = new Date().toISOString();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AI Model Scoreboard</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">Public model scores</h1>
          <p className="max-w-3xl text-sm text-slate-400">
            Built on the aims-v2 data model and score engine. Explore total scores alongside weighted deltas,
            velocity, volatility, transparency, and ecosystem depth. Desktop shows the full table; mobile uses
            a readable card layout.
          </p>
        </div>
        <p className="text-[0.75rem] text-slate-500">Last generated {generatedAt}</p>
      </header>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Leaderboard</p>
          <p className="text-sm text-slate-500">Scores refresh with each snapshot of the aims-v2 data files.</p>
        </div>
        <V2LeaderboardTable entries={ranked} />
      </section>
    </div>
  );
}
