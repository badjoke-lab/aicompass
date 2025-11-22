import { getSnapshot } from "@/lib/v3/snapshot";

export const revalidate = 300;

export default async function ScoresPage() {
  const snapshot = await getSnapshot();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">AIMS · v3</p>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">Real-time AI model signals</h1>
        <p className="max-w-3xl text-sm text-slate-400">
          Scores are computed from live Hugging Face metadata. Downloads drive adoption, likes proxy ecosystem pull,
          and recent updates reward velocity. Data refreshes on every request with a short cache to protect the API.
        </p>
        <p className="text-xs text-slate-500">Updated {new Date(snapshot.updatedAt).toLocaleString()}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sources tracked" value={snapshot.metrics.sourceCount} helper="Hugging Face repos" />
        <StatCard label="Healthy responses" value={snapshot.metrics.readyCount} helper="Fetches that returned data" />
        <StatCard
          label="Adoption weight"
          value={(snapshot.scores.weights.adoption * 100).toFixed(0)}
          helper="Scaled downloads"
        />
        <StatCard
          label="Velocity weight"
          value={(snapshot.scores.weights.velocity * 100).toFixed(0)}
          helper="Favors recent updates"
        />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-surface/80 shadow-xl">
        <div className="border-b border-slate-800 px-4 py-3 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Live snapshot</h2>
          <p className="text-xs text-slate-500">
            Hugging Face → normalize → weighted scores → render. Lower recency values mean fresher updates.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-background/60 text-[0.65rem] uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Model</th>
                <th className="px-3 py-3 text-right">Downloads</th>
                <th className="px-3 py-3 text-right">Likes</th>
                <th className="px-3 py-3 text-right">Recency (days)</th>
                <th className="px-3 py-3 text-right">Adoption</th>
                <th className="px-3 py-3 text-right">Ecosystem</th>
                <th className="px-3 py-3 text-right">Velocity</th>
                <th className="px-3 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.models.map((model, index) => (
                <tr key={model.id} className="border-t border-slate-800/70 bg-background/30 hover:bg-background/60">
                  <td className="px-3 py-3 text-right text-slate-500">{index + 1}</td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-slate-50">{model.name}</div>
                    <p className="text-xs text-slate-400">{model.provider}</p>
                    {model.focus && <p className="text-[0.65rem] text-slate-500">{model.focus}</p>}
                    <p className="text-[0.65rem] text-slate-500">{model.source}</p>
                    {model.status === "error" && (
                      <p className="text-[0.65rem] text-amber-300">Fetch error: {model.error}</p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-100">
                    {formatNumber(model.metrics.downloads)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-100">
                    {formatNumber(model.metrics.likes)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-100">
                    {model.metrics.recencyDays ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-50">
                    {model.scores.adoption.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-50">
                    {model.scores.ecosystem.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-50">
                    {model.scores.velocity.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-accent">
                    {model.scores.total.toFixed(1)}
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

function formatNumber(value: number) {
  return Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

function StatCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-background/50 px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-50">{value}</p>
      <p className="text-[0.7rem] text-slate-500">{helper}</p>
    </div>
  );
}
