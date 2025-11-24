import type { Metadata } from "next";
import Link from "next/link";

import { buildPageMetadata } from "@/lib/metadata";

const changelogEntries = [
  {
    version: "v3.1 public release",
    date: "2024",
    summary:
      "Public launch of the v3 scoreboard with refreshed layouts, launch notes, and documentation for the snapshot pipeline.",
    highlights: [
      "Homepage polish with clearer snapshot age, card spacing, and table rhythm for readability.",
      "Lightweight loading skeletons and short cache windows to keep responses stable while Hugging Face data refreshes.",
      "Footer and navigation alignment, plus Support and Donate anchors that guide contributors.",
      "Launch notes published alongside docs covering the pipeline, API endpoints, and soft-launch caveats.",
    ],
    links: [
      {
        label: "Launch notes (GitHub)",
        href: "https://github.com/ai-model-scoreboard/ai-model-scoreboard/blob/main/docs/launch-notes.md",
      },
      {
        label: "Pipeline snapshot docs",
        href: "https://github.com/ai-model-scoreboard/ai-model-scoreboard/blob/main/docs/v3-snapshot.md",
      },
    ],
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Changelog",
  description: "Track AI Model Scoreboard releases, launch notes, and public documentation links.",
  path: "/docs/changelog",
  openGraphType: "article",
});

export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Docs</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">Changelog</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
          Release notes and deltas for the public AI Model Scoreboard. Each entry links back to the source documentation so you
          can verify the changes and constraints for the current version.
        </p>
      </header>

      <div className="space-y-6">
        {changelogEntries.map((entry) => (
          <article
            key={entry.version}
            className="space-y-4 rounded-2xl border border-slate-800 bg-background/60 p-6 shadow-lg"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Launch notes</p>
                <h2 className="text-2xl font-semibold text-slate-50">{entry.version}</h2>
              </div>
              <span className="self-start rounded-full border border-slate-800/80 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                {entry.date}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{entry.summary}</p>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Highlights</p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-accent">
              {entry.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-semibold underline-offset-4 hover:bg-accent/20"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
