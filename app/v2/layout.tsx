import type { ReactNode } from "react";

export const metadata = {
  title: "AIMS v2 prototype",
  description: "Internal-only aims-v2 prototype surfaces."
};

export default function V2PrototypeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-300">
        <p className="font-semibold text-slate-100">AIMS v2 prototype</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          This non-public workspace renders the v2 score engine snapshots for experimentation.
          Routes under <code className="rounded bg-slate-800 px-1 py-0.5 text-[0.7rem]">/v2</code>
          reuse the existing data model but avoid any v1 UI impact. Share links manually as there
          are no navigation hooks yet.
        </p>
      </section>
      {children}
    </div>
  );
}
