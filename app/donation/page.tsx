const donationLinks = [
  {
    label: "Stripe",
    href: "https://donate.stripe.com/6oEg2w0G1e0ldLa288",
    description: "One-time or recurring card donations via Stripe Checkout.",
  },
  {
    label: "Ko-fi",
    href: "https://ko-fi.com/aimodelscoreboard",
    description: "Buy a coffee and leave a note with research requests.",
  },
];

const wallets = [
  {
    asset: "XRP",
    address: "rPVMhWB3DR57cWFbL6rG5VNz48FGNdJv9q",
    memo: "Tag not required",
  },
  {
    asset: "ETH",
    address: "0x4F3C5c9fF2b9B7C933F1A6F7554A95A1bCAbC11",
    memo: "Supports any ERC-20 stablecoin",
  },
];

export default function DonationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
          Support AI Model Scoreboard
        </h1>
        <p className="text-sm text-slate-400">
          Donations keep the scoreboard vendor-neutral, cover hosting for data
          snapshots, and let us commission independent evals when vendors stay
          quiet. Every contribution goes straight to maintenance and research.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Direct donations
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {donationLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-accent/40 bg-slate-900/40 p-4 transition hover:border-accent"
            >
              <div className="text-base font-semibold text-slate-50">
                {link.label}
              </div>
              <p className="text-sm text-slate-400">{link.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Crypto wallets
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {wallets.map((wallet) => (
            <div
              key={wallet.asset}
              className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/30 p-4"
            >
              <div className="text-base font-semibold text-slate-50">
                {wallet.asset}
              </div>
              <p className="break-all text-sm font-mono text-slate-300">
                {wallet.address}
              </p>
              <p className="text-xs text-slate-500">{wallet.memo}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-500">
        Need an invoice or different rails? Email
        <span className="font-semibold text-slate-300"> hello@aimodelscoreboard.org </span>
        and we’ll work it out.
      </p>
    </div>
  );
}
