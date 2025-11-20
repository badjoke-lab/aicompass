import type { ReactNode } from "react";

export const metadata = {
  title: "AIMS v2 prototype",
  description: "Internal-only aims-v2 prototype surfaces.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-lg font-semibold tracking-tight">AIMS v2 prototype</h1>
        </div>
      </header>
      <main className="px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-8">{children}</div>
      </main>
    </div>
  );
}
