import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_MODELS } from '../../lib/mockModels';
import { calcDelta30d, getModelById } from '../../lib/utils';

interface ModelPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return MOCK_MODELS.map((model) => ({ id: model.id }));
}

export default function ModelDetailPage({ params }: ModelPageProps) {
  const model = getModelById(params.id);

  if (!model) {
    return notFound();
  }

  const delta = calcDelta30d(model);
  const formattedDelta = `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-slate-300">{model.vendor.name}</p>
          <h2 className="text-3xl font-semibold">{model.name}</h2>
          <p className="text-sm text-slate-400">Modality: {model.modality.join(', ')}</p>
        </div>
        <Link
          href="/v4"
          className="rounded border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          ← Back to leaderboard
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total</p>
          <p className="text-4xl font-bold text-emerald-200">{model.total.toFixed(1)}</p>
          <p className="text-sm text-slate-300">30d delta: {formattedDelta}</p>
        </div>
        <div className="md:col-span-2 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Subscores</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(model.subscores).map(([label, value]) => (
              <div key={label} className="rounded bg-slate-800/60 p-3">
                <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="text-lg font-semibold text-slate-100">{value.toFixed(1)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Evidence</p>
        <ul className="mt-4 space-y-3">
          {model.evidence.map((item) => (
            <li key={`${item.label}-${item.updatedAt}`} className="space-y-1">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-emerald-200 hover:underline"
              >
                {item.label}
              </a>
              <p className="text-xs text-slate-400">Updated: {item.updatedAt}</p>
              {item.note && <p className="text-sm text-slate-200">{item.note}</p>}
              {typeof item.score === 'number' && (
                <p className="text-xs text-slate-300">Score: {item.score}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
