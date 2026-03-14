"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

function FoosballShape() {
  return (
    <svg
      viewBox="0 0 120 28"
      aria-hidden="true"
      className="h-[1.4rem] w-[5.6rem] text-[rgb(var(--accent-rgb))] opacity-90"
      fill="none"
    >
      <line x1="2" y1="14" x2="118" y2="14" stroke="currentColor" strokeWidth="2.4" />
      <rect x="28.5" y="8.5" width="15" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="36" cy="5.5" r="4.4" stroke="currentColor" strokeWidth="2" />
      <path d="M32.8 19.8H39.2L37.6 26.2H34.4Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="72.5" y="8.5" width="15" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="80" cy="5.5" r="4.4" stroke="currentColor" strokeWidth="2" />
      <path d="M76.8 19.8H83.2L81.6 26.2H78.4Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="56" cy="22.5" r="4.2" fill="currentColor" />
    </svg>
  );
}

export function HomeStickyHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const showAdminLogout = pathname.startsWith("/admin");

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsOpen(false);
    router.push("/admin");
    router.refresh();
  };

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
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="brand-logo text-4xl tracking-wider text-[rgb(var(--accent-rgb))] transition hover:brightness-110"
              onClick={() => setIsOpen(false)}
            >
              OTM
            </Link>
            <FoosballShape />
          </div>

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
                {showAdminLogout ? (
                  <li>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10 hover:text-[rgb(var(--accent-rgb))]"
                    >
                      Logout
                    </button>
                  </li>
                ) : null}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
