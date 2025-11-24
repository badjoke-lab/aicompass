import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/metadata";

const donationLinks = [
  {
    label: "Stripe Payment Link",
    href: "https://stripe.com/payments/placeholder",
    description:
      "Placeholder checkout link for card donations. Replace once the production Stripe Payment Link is issued.",
  },
  {
    label: "Ko-fi Profile",
    href: "https://ko-fi.com/placeholder",
    description:
      "Support the project with small tips while we wait for the permanent Ko-fi vanity URL.",
  },
];

const wallets = [
  {
    asset: "BTC",
    address: "bc1-placeholder-bitcoin-wallet-address",
    memo: "Mainnet SegWit placeholder until multisig is configured.",
  },
  {
    asset: "ETH",
    address: "0xplaceholderETHaddress000000000000000000000000",
    memo: "Use for native ETH or ERC-20 transfers until custodial wallet goes live.",
  },
  {
    asset: "USDT",
    address: "TRC20-placeholder-usdt-wallet-address",
    memo: "Shown for stablecoin supporters; swap with production wallet ID later.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Donation",
  description:
    "Contribute to AI Model Scoreboard hosting, evaluation runs, and open reporting through direct and crypto options.",
  path: "/donation",
});

export default function DonationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3" id="donate">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Donate</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">Support AI Model Scoreboard</h1>
        <p className="text-sm leading-relaxed text-slate-400">
          Donations keep the scoreboard vendor-neutral, cover hosting for data snapshots, and let us commission independent
          evals when vendors stay quiet. Every contribution goes straight to maintenance and research.
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
          Crypto wallets (placeholder)
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
        Need an invoice, bank wire, or verified wallet? Email
        <span className="font-semibold text-slate-300"> hello@aimodelscoreboard.org </span>
        and we’ll send the production credentials.
      </p>
    </div>
  );
}
