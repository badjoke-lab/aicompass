export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>© {new Date().getFullYear()} BadJoke-Lab · AI Compass v2</div>
        <div className="flex flex-wrap gap-3">
          <span className="text-slate-600">
            Minimal. Transparent. Data-first.
          </span>
        </div>
      </div>
    </footer>
  );
}
