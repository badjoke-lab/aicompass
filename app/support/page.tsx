export const revalidate = 60;

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Support</p>
        <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">Support AIMS</h1>
      </header>
      <div className="space-y-4 text-sm text-slate-400">
        <p className="max-w-2xl">
          The AI Model Scoreboard is an independent, community-supported effort focused on transparent
          evidence, open metrics, and meaningful deltas. Your contributions help us cover hosting,
          evaluation runs, and the shared resources that keep the project trustworthy and accessible.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-slate-200">
          <a
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            href="https://stripe.com/placeholder"
            target="_blank"
            rel="noreferrer"
          >
            Support via Stripe
          </a>
          <a
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            href="https://ko-fi.com/placeholder"
            target="_blank"
            rel="noreferrer"
          >
            Support via Ko-fi
          </a>
        </div>
        <p className="max-w-2xl">
          If you prefer to share feedback or collaborate, feel free to reach out — every note helps us
          prioritize the tools and benchmarks that matter most to the community.
        </p>
      </div>
    </div>
  );
}
