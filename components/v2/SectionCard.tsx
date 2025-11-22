import type { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SectionCard({ title, description, children, action }: SectionCardProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-slate-800 bg-surface/80 p-6">
      {(title || description || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            {title ? <h2 className="text-lg font-semibold text-slate-50">{title}</h2> : null}
            {description ? <p className="text-sm text-slate-400">{description}</p> : null}
          </div>
          {action ? <div className="text-sm text-slate-300">{action}</div> : null}
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </section>
  );
}
