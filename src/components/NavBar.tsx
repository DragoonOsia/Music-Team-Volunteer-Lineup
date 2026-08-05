"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "Worship Lineup" },
  { href: "/services", label: "Services" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/archive", label: "Archive" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-rule bg-paper">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-7">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 pb-[3px] font-mono text-xs tracking-[0.14em] uppercase ${
                  active
                    ? "border-accent font-medium text-accent"
                    : "border-transparent font-normal text-ink3 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
