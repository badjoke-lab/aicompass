import "./globals.css";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import HealthIndicator from "@/components/HealthIndicator";

export const metadata = {
  title: "AI Model Scoreboard",
  description:
    "Independent AI model rankings focused on transparent evidence, open metrics, and meaningful deltas.",
  openGraph: {
    title: "AI Model Scoreboard | Transparent AI evaluations",
    description:
      "Evidence-first AI model rankings with open metrics, transparent methods, and trustworthy benchmarks.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-slate-100">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="border-t border-slate-800 bg-background/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-[0.8rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="space-y-1 leading-tight">
                <div className="font-semibold text-slate-300">AI Model Scoreboard</div>
                <div>© {new Date().getFullYear()} · Evidence-first · Open metrics · Community supported</div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a href="/support" className="text-slate-300 underline-offset-4 hover:text-accent">
                  Support
                </a>
                <HealthIndicator />
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
