import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import HealthIndicator from "@/components/HealthIndicator";
import { baseMetadata } from "@/lib/metadata";
import ReleaseBanner from "@/components/ReleaseBanner";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-slate-100">
        <div className="flex min-h-screen flex-col">
          <Header />
          <ReleaseBanner />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-10">
            {children}
          </main>
          <footer aria-label="Site footer" className="border-t border-slate-800 bg-background/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-[0.8rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="space-y-1 leading-tight">
                <div className="font-semibold text-slate-300">AI Model Scoreboard</div>
                <div>© {new Date().getFullYear()} · Evidence-first · Open metrics · Community supported</div>
              </div>
              <div className="flex flex-col gap-2 text-right sm:items-end">
                <nav aria-label="Footer" className="flex flex-wrap items-center justify-end gap-3 text-slate-400 sm:justify-end">
                  <a
                    aria-label="Support AI Model Scoreboard"
                    href="/support"
                    className="text-slate-300 underline-offset-4 hover:text-accent"
                  >
                    Support
                  </a>
                  <a
                    aria-label="Donate to AI Model Scoreboard"
                    href="/donation"
                    className="text-slate-300 underline-offset-4 hover:text-accent"
                  >
                    Donate
                  </a>
                  <a
                    aria-label="View changelog"
                    href="/docs/changelog"
                    className="text-slate-300 underline-offset-4 hover:text-accent"
                  >
                    Changelog
                  </a>
                  <HealthIndicator />
                </nav>
                <p className="text-[0.75rem] text-slate-600">
                  Data is aggregated from public sources; please verify before making critical decisions.
                </p>
                <p className="text-[0.75rem] text-slate-600">
                  AI Model Scoreboard is informational only and does not provide investment, compliance, or security advice.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
