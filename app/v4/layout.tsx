import type { ReactNode } from "react";

export default function V4Layout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-background text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-12">
        {children}
      </div>
    </section>
  );
}
