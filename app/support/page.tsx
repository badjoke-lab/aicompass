import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Support",
  description:
    "Support the AI Model Scoreboard with feedback, outreach, or contributions that keep the leaderboard independent.",
  path: "/support",
});

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Support</p>
        <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">Support AIMS</h1>
      </header>
      <div className="space-y-4 text-sm text-slate-400">
        <p className="max-w-2xl">
          The AI Model Scoreboard is an independent, community-supported effort focused on transparent evidence, open metrics,
          and meaningful deltas. Your contributions help us cover hosting, evaluation runs, and the shared resources that keep
          the project trustworthy and accessible.
        </p>
        <div className="space-y-2">
          <p className="font-semibold text-slate-200">Ways to help</p>
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>Share feedback on coverage gaps, model accuracy, or data freshness.</li>
            <li>Coordinate with vendors to surface public changelogs, evals, and pricing notes.</li>
            <li>Fund hosting and snapshot processing to keep the leaderboard freely available.</li>
            <li>Introduce collaborators who can contribute benchmarks or reliability checks.</li>
          </ul>
        </div>
        <p className="max-w-2xl">
          If you prefer to share feedback or collaborate, feel free to reach out — every note helps us prioritize the tools and
          benchmarks that matter most to the community.
        </p>
      </div>
    </div>
  );
}
