import Link from "next/link";

export default function DocsNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
      <div className="text-5xl">📄</div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">Docs page missing</h1>
        <p className="text-sm text-slate-400">
          We couldn&apos;t find the documentation page you requested. Browse the available references instead.
        </p>
      </div>
      <Link href="/docs" className="text-sm font-semibold text-accent underline">
        Back to docs
      </Link>
    </div>
  );
}
