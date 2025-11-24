import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
      <div className="text-5xl">🛰️</div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">Page not found</h1>
        <p className="text-sm text-slate-400">
          The page you are looking for doesn&apos;t exist or has been moved. Please check the URL or head back
          to the scoreboard.
        </p>
      </div>
      <Link href="/" className="text-sm font-semibold text-accent underline">
        Return to home
      </Link>
    </div>
  );
}
