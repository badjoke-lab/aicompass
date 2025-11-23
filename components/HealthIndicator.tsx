"use client";

import { useEffect, useState } from "react";

type HealthBadge = "LIVE" | "STALE" | "ERROR" | "LOADING";

interface HealthPayload {
  status?: string;
  snapshot?: { ageSeconds?: number | null };
}

const STALE_THRESHOLD_SECONDS = 6 * 60 * 60;

export default function HealthIndicator() {
  const [status, setStatus] = useState<HealthBadge>("LOADING");

  useEffect(() => {
    let cancelled = false;

    const loadHealth = async () => {
      try {
        const response = await fetch("/api/health", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Health check failed");
        }

        const payload = (await response.json()) as HealthPayload;
        const healthStatus = payload.status?.toLowerCase();
        const snapshotAgeSeconds = payload.snapshot?.ageSeconds ?? null;

        if (cancelled) return;

        if (healthStatus !== "ok") {
          setStatus("ERROR");
          return;
        }

        if (typeof snapshotAgeSeconds === "number") {
          setStatus(snapshotAgeSeconds >= STALE_THRESHOLD_SECONDS ? "STALE" : "LIVE");
          return;
        }

        setStatus("ERROR");
      } catch (error) {
        if (!cancelled) {
          setStatus("ERROR");
        }
      }
    };

    loadHealth();
    const interval = setInterval(loadHealth, 5 * 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const color =
    status === "LIVE"
      ? "text-emerald-400"
      : status === "STALE"
        ? "text-amber-300"
        : status === "ERROR"
          ? "text-rose-400"
          : "text-slate-500";

  const label = status === "LOADING" ? "Checking" : status;

  return (
    <a
      className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide transition-colors ${color}`}
      href="/api/health"
      rel="noreferrer"
      target="_blank"
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="tabular-nums min-w-[8rem] text-right">Health: {label}</span>
    </a>
  );
}
