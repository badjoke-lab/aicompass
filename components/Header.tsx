"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Scores" },
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/donation", label: "Donation" }
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            🧭
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              BadJoke-Lab
            </div>
            <div className="text-lg font-semibold text-slate-50">
              AI Compass
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`hidden text-xs font-medium uppercase tracking-wide sm:inline ${
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
            className="rounded-full border border-accent bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent hover:bg-accent/20"
          >
            Donate
          </Link>
        </nav>
      </div>
    </header>
  );
}
