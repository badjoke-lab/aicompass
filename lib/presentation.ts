export type HealthStatus = "ok" | "degraded" | "unavailable";

export function formatCompactNumber(value: number) {
  return Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function formatSnapshotAge(ageSeconds: number | null) {
  if (ageSeconds == null) {
    return "—";
  }

  if (ageSeconds < 10) {
    return "just updated";
  }

  if (ageSeconds < 60) {
    const seconds = Math.floor(ageSeconds);
    return `${seconds} sec${seconds === 1 ? "" : "s"} ago`;
  }

  const minutes = Math.floor(ageSeconds / 60);
  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function getHealthLabel(status: HealthStatus) {
  if (status === "ok") return "Healthy";
  if (status === "degraded") return "Degraded";
  return "Unavailable";
}
