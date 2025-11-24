"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISS_KEY = "aims-v3-banner-dismissed";

export default function ReleaseBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "true");
  };

  return (
    <div className="border-b border-accent/40 bg-accent/10 text-accent">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em]">Launch</p>
          <p className="text-sm font-semibold text-accent">v3 is live — read the launch notes and recent deltas.</p>
          <div className="flex flex-wrap gap-3 text-[0.85rem]">
            <Link
              aria-label="Open changelog and launch notes"
              href="/docs/changelog"
              className="underline underline-offset-4 hover:text-accent/80"
            >
              Changelog & Launch notes
            </Link>
            <Link
              aria-label="Share feedback on AI Model Scoreboard"
              href="/support"
              className="underline underline-offset-4 hover:text-accent/80"
            >
              Share feedback
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss release banner"
          className="self-start rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-accent/10"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
