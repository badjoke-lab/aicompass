import LeaderboardCard from "@/components/LeaderboardCard";
import LeaderboardTable from "@/components/LeaderboardTable";
import MoversList from "@/components/MoversList";
import StatsBar from "@/components/StatsBar";
import {
  DELTA_WINDOW_DAYS,
  getModels,
  getSortedModels,
  getSpikes,
  getSummaryStats
} from "@/lib/models";

const sortedModels = getSortedModels(getModels());
const { gainers, droppers } = getSpikes(sortedModels);
const stats = getSummaryStats(sortedModels);

export default function ScoresPage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          AI Model Scoreboard · aims-v1
        </p>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          Transparent AI model leaderboard
        </h1>
        <p className="max-w-3xl text-sm text-slate-400">
          Compare foundation models across performance, safety, cost, reliability,
          transparency, ecosystem signals, and adoption. Scores stay local, open,
          and are recalculated every {DELTA_WINDOW_DAYS}-day delta window.
        </p>
      </section>

      <StatsBar stats={stats} windowDays={DELTA_WINDOW_DAYS} />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Live leaderboard
            </p>
            <p className="text-sm text-slate-500">
              Desktop shows full table. Mobile switches to adaptive cards.
            </p>
          </div>
        </div>

        <LeaderboardTable models={sortedModels} windowDays={DELTA_WINDOW_DAYS} />

        <div className="grid gap-3 md:hidden">
          {sortedModels.map((model, index) => (
            <LeaderboardCard key={model.slug} model={model} rank={index + 1} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Spikes & Movers
          </p>
          <p className="text-sm text-slate-500">
            Highlights any model with ≥ ±3 total change over the last {DELTA_WINDOW_DAYS} days.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <MoversList title="Spike ↑ movers" models={gainers} direction="up" />
          <MoversList title="Spike ↓ movers" models={droppers} direction="down" />
        </div>
        <p className="text-[0.65rem] text-slate-500">
          Waiting models are shown but not considered in spike calculations until more public evidence arrives.
        </p>
      </section>
    </div>
  );
}
