"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { shellClass } from "@/lib/layout";

const navItems = [
  { href: "/", label: "Scores" },
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/donation", label: "Donation" },
  { href: "/docs/changelog", label: "Changelog" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-background/80 backdrop-blur">
      <div className={`${shellClass} flex items-center justify-between py-3 sm:py-3.5`}>
        <Link aria-label="AI Model Scoreboard home" href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            🧮
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              AI Model Scoreboard
            </div>
            <div className="text-lg font-semibold text-slate-50">Independent rankings</div>
          </div>
        </Link>

        <nav aria-label="Primary navigation" className="flex items-center gap-3 sm:gap-4 text-sm">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={`Navigate to ${item.label}`}
                className={`hidden text-[0.75rem] font-semibold uppercase tracking-wide sm:inline ${
                  active
                    ? "text-slate-50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/donation"
            aria-label="Donate to support the AI Model Scoreboard"
            className="rounded-full border border-accent bg-accent/10 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-accent shadow-sm transition hover:bg-accent/20"
          >
            Donate
          </Link>
        </nav>
      </div>
    </header>
  );
}
