import LeaderboardTable from "@/components/v2/LeaderboardTable";
import { V2_DELTA_WINDOW_DAYS, v2ScoreEngine } from "@/lib/v2";

const snapshots = v2ScoreEngine.getSnapshots();

export const metadata = {
  title: "AIMS v2 · Leaderboard"
};

export default function V2LeaderboardPage() {
  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">aims v2</p>
        <div>
          <h1 className="text-3xl font-semibold text-slate-50">Leaderboard</h1>
          <p className="text-sm text-slate-400">Static placeholder using v2-only surface.</p>
        </div>
      </header>

      <LeaderboardTable entries={snapshots} windowLabel={`Δ${V2_DELTA_WINDOW_DAYS}d`} />
    </main>
  );
}
