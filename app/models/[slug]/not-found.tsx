import Link from "next/link";

export default function ModelNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
      <div className="text-5xl">📊</div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">Model not found</h1>
        <p className="text-sm text-slate-400">
          The model you requested isn&apos;t in the current snapshot. It may have been removed or not yet tracked.
        </p>
      </div>
      <Link href="/" className="text-sm font-semibold text-accent underline">
        Back to scoreboard
      </Link>
    </div>
  );
}
