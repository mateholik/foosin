"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/#leaderboard", label: "Leaderboard" },
  { href: "/#best-teams", label: "Best teams" },
  { href: "/#recent-games", label: "Recent game" },
  { href: "/info", label: "Stats logic" },
];

export function HomeStickyHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    }

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex w-full items-center justify-between border-b border-white/10 bg-[#171d2b]/92 px-3 py-2.5 backdrop-blur-sm sm:px-5">
        <div
          ref={menuRef}
          className="relative flex w-full items-center justify-between"
        >
          <Link
            href="/"
            className="brand-logo text-4xl tracking-wider text-[rgb(var(--accent-rgb))] transition hover:brightness-110"
            onClick={() => setIsOpen(false)}
          >
            OTM
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-slate-100 transition hover:bg-white/10"
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>

          {isOpen ? (
            <nav className="absolute right-0 top-14 min-w-52 rounded-xl border border-white/15 bg-[#171d2b]/95 p-2 shadow-xl backdrop-blur-sm">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-[rgb(var(--accent-rgb))]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
