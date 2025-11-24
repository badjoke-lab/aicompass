"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ModelError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
      <div className="text-5xl">📉</div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">Model page failed to load</h1>
        <p className="text-sm text-slate-400">Try again or return to the main scores while we recover.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-slate-800 bg-background px-4 py-2 font-semibold text-slate-100 hover:border-accent"
        >
          Retry
        </button>
        <Link href="/" className="font-semibold text-accent underline">
          Back to scoreboard
        </Link>
      </div>
    </div>
  );
}
