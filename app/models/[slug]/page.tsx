import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSnapshot } from "@/lib/v3/snapshot";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const snapshot = await getSnapshot();
  const model = snapshot.models.find((entry) => entry.slug === params.slug);

  if (!model) {
    return {
      title: "Model not found | AI Model Scoreboard",
      description: "The requested model is not present in the current snapshot.",
    };
  }

  const title = `${model.name} | AI Model Scoreboard`;
  const description = `Live signals for ${model.name} by ${model.provider}. Downloads, likes, recency, and composite scores updated with each snapshot.`;
  const url = `https://ai-model-scoreboard.vercel.app/models/${model.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/models/${model.slug}` },
    openGraph: {
      title,
      description,
      url,
      siteName: "AI Model Scoreboard",
      type: "article",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${model.name} leaderboard placement`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function ModelDetailPage({ params }: { params: { slug: string } }) {
  const snapshot = await getSnapshot();
  const model = snapshot.models.find((entry) => entry.slug === params.slug);

  if (!model) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v3</p>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">{model.name}</h1>
        <p className="text-sm text-slate-400">Provider: {model.provider}</p>
        {model.focus && <p className="text-xs text-slate-500">Focus: {model.focus}</p>}
        <p className="text-xs text-slate-500">
          Source: <Link href={model.source} className="text-accent underline">Hugging Face</Link>
        </p>
        <p className="text-xs text-slate-500">Snapshot updated {new Date(snapshot.updatedAt).toLocaleString()}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Downloads" value={formatNumber(model.metrics.downloads)} helper="Cumulative" />
        <MetricCard label="Likes" value={formatNumber(model.metrics.likes)} helper="Community interest" />
        <MetricCard
          label="Last modified"
          value={model.metrics.lastModified ? new Date(model.metrics.lastModified).toLocaleDateString() : "Unknown"}
          helper="UTC"
        />
        <MetricCard
          label="Recency (days)"
          value={model.metrics.recencyDays ?? "—"}
          helper="Lower is fresher"
        />
        <MetricCard label="Adoption score" value={model.scores.adoption.toFixed(1)} helper="Weighted" />
        <MetricCard label="Ecosystem score" value={model.scores.ecosystem.toFixed(1)} helper="Weighted" />
        <MetricCard label="Velocity score" value={model.scores.velocity.toFixed(1)} helper="Weighted" />
        <MetricCard label="Total score" value={model.scores.total.toFixed(1)} helper="Composite" />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-surface/80 p-4 shadow-xl sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Methodology</h2>
        <p className="mt-2 text-sm text-slate-400">
          Scores come directly from live Hugging Face repository metadata. Downloads represent adoption, likes proxy ecosystem
          engagement, and recent updates fuel velocity. Each dimension is scaled relative to peers in the snapshot and combined
          using fixed weights.
        </p>
      </section>

      <Link href="/" className="text-sm text-accent underline">
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

function formatNumber(value: number) {
  return Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}
