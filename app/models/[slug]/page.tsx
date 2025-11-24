import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { metaPillClass } from "@/lib/layout";
import { buildPageMetadata } from "@/lib/metadata";
import { formatCompactNumber, formatSnapshotAge, getHealthLabel } from "@/lib/presentation";
import { getHealth, getSnapshot } from "@/lib/v3/snapshot";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const snapshot = await getSnapshot();
    const model = snapshot.models.find((entry) => entry.slug === params.slug);

    if (!model) {
      return {
        ...buildPageMetadata({
          title: "Model not found",
          description: "The requested model is not present in the current snapshot.",
          path: `/models/${params.slug}`,
        }),
      };
    }

    const title = model.name;
    const description = `Live signals for ${model.name} by ${model.provider}. Downloads, likes, recency, and composite scores updated with each snapshot.`;

    return buildPageMetadata({
      title,
      description,
      path: `/models/${model.slug}`,
      openGraphType: "article",
      imageAlt: `${model.name} leaderboard placement`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Snapshot unavailable";
    return buildPageMetadata({
      title: "Model snapshot unavailable",
      description: `Unable to load model metadata right now (${message}).`,
      path: `/models/${params.slug}`,
    });
  }
}

export default async function ModelDetailPage({ params }: { params: { slug: string } }) {
  let snapshotError: string | null = null;
  let snapshot: Awaited<ReturnType<typeof getSnapshot>> | null = null;

  try {
    snapshot = await getSnapshot();
  } catch (error) {
    snapshotError = error instanceof Error ? error.message : "Unable to fetch snapshot.";
  }

  const model = snapshot?.models.find((entry) => entry.slug === params.slug);

  if (!model) {
    return notFound();
  }

  const health = getHealth();
  const healthLabel = getHealthLabel(health.status);
  const snapshotAgeLabel = formatSnapshotAge(health.snapshot.ageSeconds);
  const updatedLabel = snapshot?.updatedAt ? new Date(snapshot.updatedAt).toLocaleString() : "Unavailable";

  return (
    <div className="space-y-10">
      <header className="space-y-4 sm:space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v3</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">{model.name}</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-400">Provider: {model.provider}</p>
            {model.focus && <p className="text-xs text-slate-500">Focus: {model.focus}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start rounded-full border border-slate-800 bg-background/70 px-3 py-1.5 text-[0.75rem] uppercase tracking-wide text-slate-300 shadow-sm ring-1 ring-slate-800/60 sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <a
              href={model.source}
              target="_blank"
              rel="noreferrer"
              className="text-slate-100 underline-offset-4 hover:text-accent"
            >
              View on Hugging Face
            </a>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[0.8rem] text-slate-400">
          <span className={metaPillClass}>Snapshot: {snapshotAgeLabel}</span>
          <span className={metaPillClass}>Health: {healthLabel}</span>
          <span className="text-slate-500">Last updated: {updatedLabel}</span>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Downloads"
          value={formatCompactNumber(model.metrics.downloads)}
          helper="Cumulative"
        />
        <MetricCard
          label="Likes"
          value={formatCompactNumber(model.metrics.likes)}
          helper="Community interest"
        />
        <MetricCard
          label="Last modified"
          value={model.metrics.lastModified ? new Date(model.metrics.lastModified).toLocaleDateString() : "Unknown"}
          helper="UTC"
        />
        <MetricCard label="Recency (days)" value={model.metrics.recencyDays ?? "—"} helper="Lower is fresher" />
        <MetricCard label="Adoption score" value={model.scores.adoption.toFixed(1)} helper="Weighted" />
        <MetricCard label="Ecosystem score" value={model.scores.ecosystem.toFixed(1)} helper="Weighted" />
        <MetricCard label="Velocity score" value={model.scores.velocity.toFixed(1)} helper="Weighted" />
        <MetricCard label="Total score" value={model.scores.total.toFixed(1)} helper="Composite" />
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-surface/80 p-4 shadow-xl sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Methodology</h2>
            <p className="text-xs text-slate-500">Signals, normalization, and fixed weighting for this snapshot.</p>
          </div>
          <Link href="/methodology" className="text-xs font-semibold uppercase tracking-wide text-accent underline-offset-4 hover:text-accent/80">
            Read methodology
          </Link>
        </div>
        <div className="space-y-2 text-sm text-slate-400">
          <p>
            Scores come directly from live Hugging Face repository metadata. Downloads represent adoption, likes proxy
            ecosystem engagement, and recent updates fuel velocity. Each dimension is scaled relative to peers in the snapshot
            and combined using fixed weights.
          </p>
          {snapshotError && (
            <p className="text-amber-200">Snapshot degraded: {snapshotError}. Displaying cached or partial data.</p>
          )}
        </div>
      </section>

      <Link href="/" className="text-sm font-semibold text-accent underline">
        ← Back to leaderboard
      </Link>
    </div>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-background/50 px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-50">{value}</p>
      <p className="text-[0.7rem] text-slate-500">{helper}</p>
    </div>
  );
}

