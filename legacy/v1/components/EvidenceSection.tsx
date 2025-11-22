import type { Model } from "@/types/model";

const evidenceGroups = [
  { key: "benchmarks", label: "Benchmarks" },
  { key: "pricing", label: "Pricing" },
  { key: "safety", label: "Safety" },
  { key: "technical", label: "Technical reports" }
] as const;

interface Props {
  evidence?: Model["evidence"];
}

export default function EvidenceSection({ evidence }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {evidenceGroups.map((group) => {
        const links = evidence?.[group.key] ?? [];
        return (
          <div
            key={group.key}
            className="rounded-xl border border-slate-800 bg-surface/60 p-3 text-xs"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
              {group.label}
            </p>
            {links.length === 0 ? (
              <p className="mt-2 text-slate-500">No links published yet.</p>
            ) : (
              <ul className="mt-2 space-y-1">
                {links.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      className="text-slate-100 hover:text-accent"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formatLabel(url)}
                    </a>
                    <span className="ml-1 text-[0.6rem] text-slate-500">
                      ({getHostname(url)})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatLabel(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.pathname === "/" ? parsed.hostname : parsed.pathname.replace(/\/$/, "");
  } catch {
    return url;
  }
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
