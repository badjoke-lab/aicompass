export default function DonationPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
        Support AI Compass
      </h1>
      <p className="text-sm text-slate-400">
        If you find AI Compass useful, you can support the project to keep it
        running and evolving.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
        <li>Stripe (BadJoke-Lab): link will be added here.</li>
        <li>Crypto (BTC / USDT): addresses will be added here.</li>
      </ul>
      <p className="text-xs text-slate-500">
        This page is a placeholder. Actual donation links and wallet addresses
        will be configured once accounts are ready.
      </p>
    </div>
  );
}
