import type { Metadata } from "next";
import Link from "next/link";

import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Documentation",
  description: "Docs for AI Model Scoreboard v3 including changelog and methodology references.",
  path: "/docs",
});

export default function DocsIndexPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">Documentation</h1>
      <p className="text-sm text-slate-400">
        Quick links to the AI Model Scoreboard references. Changelog is hosted here, and deeper implementation notes live in
        the repository docs folder.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/docs/changelog"
          className="rounded-lg border border-slate-800 bg-background/60 p-4 transition hover:border-accent"
        >
          <div className="text-base font-semibold text-slate-50">Changelog</div>
          <p className="text-sm text-slate-400">Latest release notes for the scoreboard.</p>
        </Link>
        <a
          href="https://github.com/ai-model-scoreboard/ai-model-scoreboard/tree/main/docs"
          className="rounded-lg border border-slate-800 bg-background/60 p-4 transition hover:border-accent"
          target="_blank"
          rel="noreferrer"
        >
          <div className="text-base font-semibold text-slate-50">Repository docs</div>
          <p className="text-sm text-slate-400">Snapshot pipeline, API, and operational notes.</p>
        </a>
      </div>
    </div>
  );
}
