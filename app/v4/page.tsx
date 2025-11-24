import Link from 'next/link';
import { getMockModels } from './data/mockModels';
import { sortModels } from './lib/utils';

const subscoresToShow = ['reasoning', 'coding', 'safety'];

export default function V4HomePage() {
  const models = sortModels(getMockModels(), 'totalScore', 'desc');

  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold">Leaderboard</h2>
        <p className="text-sm text-slate-300">Sorted by TOTAL descending</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Modality</th>
              <th className="px-4 py-3 text-right">Total</th>
              {subscoresToShow.map((score) => (
                <th key={score} className="px-4 py-3 text-right capitalize">
                  {score}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {models.map((model, index) => (
              <tr key={model.id} className="hover:bg-slate-800/50">
                <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                <td className="px-4 py-3 font-semibold text-emerald-200">
                  <Link href={`/v4/models/${model.id}`} className="hover:underline">
                    {model.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-200">{model.vendor}</td>
                <td className="px-4 py-3 text-slate-300 capitalize">{model.modality}</td>
                <td className="px-4 py-3 text-right font-semibold">{model.totalScore.toFixed(0)}</td>
                {subscoresToShow.map((score) => (
                  <td key={score} className="px-4 py-3 text-right text-slate-200">
                    {model.subscores[score]?.toFixed(0) ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
