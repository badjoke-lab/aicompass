"use client";

import { useEffect, useState } from "react";

type HealthStatus = "OK" | "DEGRADED" | "FAILED";

export default function HealthIndicator() {
  const [status, setStatus] = useState<HealthStatus | "LOADING">("LOADING");

  useEffect(() => {
    let cancelled = false;

    const loadHealth = async () => {
      try {
        const response = await fetch("/api/health", { cache: "no-store" });
        const payload = (await response.json()) as { status?: string };
        const next = payload.status?.toUpperCase();

        if (!cancelled) {
          if (next === "OK" || next === "DEGRADED" || next === "FAILED") {
            setStatus(next);
          } else {
            setStatus("FAILED");
          }
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("FAILED");
        }
      }
    };

    loadHealth();
    const interval = setInterval(loadHealth, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const color =
    status === "OK"
      ? "text-emerald-400"
      : status === "DEGRADED"
        ? "text-amber-300"
        : status === "FAILED"
          ? "text-rose-400"
          : "text-slate-500";

  const label = status === "LOADING" ? "Checking" : status;

  return (
    <a
      className={`flex items-center gap-2 text-xs font-semibold transition-colors ${color}`}
      href="/api/health"
      rel="noreferrer"
      target="_blank"
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      <span>Health: {label}</span>
    </a>
  );
}
