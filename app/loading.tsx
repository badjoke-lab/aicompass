import { shellClass } from "@/lib/layout";

export default function Loading() {
  return (
    <div className={`${shellClass} space-y-10 animate-pulse`}>
      <header className="space-y-4 sm:space-y-5">
        <div className="h-3 w-24 rounded-full bg-slate-800" />
        <div className="space-y-2">
          <div className="h-8 w-2/3 rounded-lg bg-slate-800" />
          <div className="h-4 w-full max-w-2xl rounded-lg bg-slate-800" />
          <div className="h-4 w-5/6 max-w-xl rounded-lg bg-slate-800" />
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-3 w-48 rounded-full bg-slate-800" />
          <div className="h-8 w-44 rounded-full bg-slate-800" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-8 w-44 rounded-full bg-slate-800" />
          ))}
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-800 bg-background/50 px-4 py-3">
            <div className="h-3 w-24 rounded-full bg-slate-800" />
            <div className="mt-3 h-6 w-20 rounded-lg bg-slate-800" />
            <div className="mt-2 h-3 w-24 rounded-full bg-slate-800" />
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-surface/80 shadow-xl">
        <div className="flex flex-col gap-2 border-b border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1">
            <div className="h-4 w-32 rounded bg-slate-800" />
            <div className="h-3 w-64 rounded bg-slate-800" />
          </div>
          <div className="h-8 w-28 rounded-full bg-slate-800" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-background/60 text-[0.65rem] uppercase tracking-wide text-slate-400">
              <tr>
                {Array.from({ length: 9 }).map((_, index) => (
                  <th key={index} className="px-3 py-3 text-left">
                    <div className="h-3 w-16 rounded-full bg-slate-800" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, row) => (
                <tr key={row} className="border-t border-slate-800/70 bg-background/40">
                  <td className="px-3 py-4 text-right">
                    <div className="h-3 w-6 rounded-full bg-slate-800" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-slate-800" />
                      <div className="h-3 w-32 rounded bg-slate-800" />
                      <div className="h-2.5 w-28 rounded bg-slate-900" />
                    </div>
                  </td>
                  {Array.from({ length: 6 }).map((_, cell) => (
                    <td key={cell} className="px-3 py-4 text-right">
                      <div className="ml-auto h-3 w-14 rounded bg-slate-800" />
                    </td>
                  ))}
                  <td className="px-3 py-4 text-right">
                    <div className="ml-auto h-3 w-12 rounded bg-slate-800" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
