export default function PrivacyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
        Privacy
      </h1>
      <p className="text-sm text-slate-400">
        AI Compass does not collect personal information. Basic analytics may be
        used (e.g. Cloudflare Web Analytics, Vercel logs) to understand traffic
        and improve the service.
      </p>
      <p className="text-sm text-slate-400">
        No user accounts, no tracking cookies, and no advertising identifiers
        are used in Phase 1.
      </p>
    </div>
  );
}
