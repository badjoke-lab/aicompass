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
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Support</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">Support AIMS</h1>
      </header>
      <div className="space-y-4 text-sm leading-relaxed text-slate-400">
        <p className="max-w-2xl text-slate-300">
          The AI Model Scoreboard stays independent through community support: open feedback, transparent metrics, and shared
          resources that keep the leaderboard trustworthy and accessible.
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
        <p className="max-w-2xl text-slate-300">
          If you prefer to share feedback or collaborate, feel free to reach out — every note helps us prioritize the tools and
          benchmarks that matter most to the community.
        </p>
      </div>
    </div>
  );
}
