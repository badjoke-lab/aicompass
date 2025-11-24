import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DEFAULT_DESCRIPTION, buildPageMetadata } from "@/lib/metadata";
import { getHealth, getSnapshot } from "@/lib/v3/snapshot";

export const metadata: Metadata = buildPageMetadata({
  title: "Scores",
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export const revalidate = 60;

export default async function ScoresPage() {
  const snapshot = await getSnapshot();
  const health = getHealth();
  const snapshotAgeSeconds = health.snapshot.ageSeconds;
  const formattedSnapshotAge = formatSnapshotAge(snapshotAgeSeconds);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v3</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">Real-time AI model signals</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
              Scores are computed from live Hugging Face metadata. Downloads drive adoption, likes proxy ecosystem pull,
              and recent updates reward velocity. Data refreshes on every request with a short cache to protect the API.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-full border border-slate-800 bg-background/70 px-3 py-1.5 text-xs text-slate-300 shadow-sm ring-1 ring-slate-800/60 sm:self-auto sm:px-4">
            <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-400/80" />
            <div className="flex items-center gap-2 font-semibold uppercase tracking-wide text-slate-200">
              <span>Snapshot</span>
              <span className="tabular-nums min-w-[8.5rem] rounded px-2 py-0.5 text-center text-xs text-slate-300 ring-1 ring-slate-800/60">
                {formattedSnapshotAge}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-[0.8rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-400">Last updated: {new Date(snapshot.updatedAt).toLocaleString()}</p>
          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span className="tabular-nums rounded-full border border-slate-800/70 bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
              Health: {health.status.toUpperCase()}
            </span>
            <a
              href="https://github.com/ai-model-scoreboard/ai-model-scoreboard/tree/main/docs"
              className="text-xs font-semibold uppercase tracking-wide text-accent underline-offset-4 hover:text-accent/80"
              rel="noreferrer"
              target="_blank"
            >
              View docs
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          <DocLink href="https://github.com/ai-model-scoreboard/ai-model-scoreboard/blob/main/docs/v3-snapshot.md">
            Snapshot pipeline
          </DocLink>
          <DocLink href="https://github.com/ai-model-scoreboard/ai-model-scoreboard/blob/main/docs/v3-status.md">
            Refresh schedule
          </DocLink>
          <DocLink href="https://github.com/ai-model-scoreboard/ai-model-scoreboard/blob/main/docs/api.md">
            API endpoints
          </DocLink>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sources tracked" value={snapshot.metrics.sourceCount} helper="Hugging Face repos" />
        <StatCard label="Healthy responses" value={snapshot.metrics.readyCount} helper="Fetches that returned data" />
        <StatCard
          label="Adoption weight"
          value={(snapshot.scores.weights.adoption * 100).toFixed(0)}
          helper="Scaled downloads"
        />
        <StatCard
          label="Velocity weight"
          value={(snapshot.scores.weights.velocity * 100).toFixed(0)}
          helper="Favors recent updates"
        />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-surface/80 shadow-xl">
        <div className="flex flex-col gap-2 border-b border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Live snapshot</h2>
            <p className="text-xs text-slate-500">
              Hugging Face → normalize → weighted scores → render. Lower recency values mean fresher updates.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-800/70 bg-background/70 px-3 py-2 text-[0.7rem] text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-semibold text-slate-200">Age</span>
            <span className="text-slate-400 tabular-nums min-w-[6.5rem] text-right">{formattedSnapshotAge}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-background/60 text-[0.65rem] uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Model</th>
                <th className="px-3 py-3 text-right">Downloads</th>
                <th className="px-3 py-3 text-right">Likes</th>
                <th className="px-3 py-3 text-right">Recency (days)</th>
                <th className="px-3 py-3 text-right">Adoption</th>
                <th className="px-3 py-3 text-right">Ecosystem</th>
                <th className="px-3 py-3 text-right">Velocity</th>
                <th className="px-3 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.models.map((model, index) => (
                <tr key={model.id} className="border-t border-slate-800/70 bg-background/30 hover:bg-background/60">
                  <td className="px-3 py-4 align-top text-right text-slate-500 sm:py-3 sm:align-middle">{index + 1}</td>
                  <td className="px-3 py-4 align-top sm:py-3 sm:align-middle">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-50">{model.name}</div>
                      <p className="text-xs text-slate-400">{model.provider}</p>
                      {model.focus && <p className="text-[0.65rem] text-slate-500">{model.focus}</p>}
                      <p className="text-[0.65rem] text-slate-500">{model.source}</p>
                      {model.status === "error" && (
                        <p className="text-[0.65rem] text-amber-300">Fetch error: {model.error}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums text-slate-100 sm:py-3">
                    {formatNumber(model.metrics.downloads)}
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums text-slate-100 sm:py-3">
                    {formatNumber(model.metrics.likes)}
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums text-slate-100 sm:py-3">
                    {model.metrics.recencyDays ?? "—"}
                  </td>
                  <td className="px-3 py-4 text-right font-semibold text-slate-50 sm:py-3">
                    {model.scores.adoption.toFixed(1)}
                  </td>
                  <td className="px-3 py-4 text-right font-semibold text-slate-50 sm:py-3">
                    {model.scores.ecosystem.toFixed(1)}
                  </td>
                  <td className="px-3 py-4 text-right font-semibold text-slate-50 sm:py-3">
                    {model.scores.velocity.toFixed(1)}
                  </td>
                  <td className="px-3 py-4 text-right font-semibold text-accent sm:py-3">
                    {model.scores.total.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function formatNumber(value: number) {
  return Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

function formatSnapshotAge(ageSeconds: number | null) {
  if (ageSeconds == null) {
    return "—";
  }

  if (ageSeconds < 10) {
    return "just now";
  }

  if (ageSeconds < 60) {
    const seconds = Math.floor(ageSeconds);
    return `${seconds} sec${seconds === 1 ? "" : "s"} ago`;
  }

  const minutes = Math.floor(ageSeconds / 60);
  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function StatCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-background/50 px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-50">{value}</p>
      <p className="text-[0.7rem] text-slate-500">{helper}</p>
    </div>
  );
}

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-background/60 px-3 py-1 font-semibold uppercase tracking-wide text-slate-200 underline-offset-4 transition-colors hover:text-accent"
      rel="noreferrer"
      target="_blank"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      <span>{children}</span>
    </a>
  );
}
