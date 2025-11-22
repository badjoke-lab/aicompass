export default function PrivacyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
        Privacy
      </h1>
      <p className="text-sm text-slate-400">
        AI Model Scoreboard does not collect personal information. Basic
        privacy-respecting analytics (e.g. Cloudflare Web Analytics, Vercel
        logs) are used only to understand traffic patterns and keep the service
        stable.
      </p>
      <p className="text-sm text-slate-400">
        No user accounts, no tracking cookies, and no advertising identifiers
        are used in Phase 1.
      </p>
    </div>
  );
}
