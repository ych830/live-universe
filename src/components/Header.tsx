"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/#about", label: "ABOUT" },
  { href: "/performances", label: "PROJECT" },
  { href: "/companies", label: "COMPANIES" },
  { href: "/#contact", label: "CONTACT" },
];

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export function Header() {
  const pathname = usePathname();
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);

  return (
    <header className="relative z-40 border-b border-rule bg-paper/70 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" aria-label="LIVE UNIVERSE 홈" onClick={() => setMenu(false)}>
          <Logo />
        </Link>
        <div className="flex items-center gap-1 md:gap-0">
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => {
              const active = !n.href.includes("#") && pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} className="relative py-2 font-display text-[12px] font-semibold tracking-[0.06em] hover:opacity-60">
                  {n.label}
                  {active && <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-text" />}
                </Link>
              );
            })}
          </nav>
          <button type="button" onClick={() => { setSearch((v) => !v); setMenu(false); }} aria-label="공연 검색" aria-expanded={search} className="flex h-10 w-10 items-center justify-center hover:opacity-60 md:ml-3">
            <SearchIcon />
          </button>
          <button
            type="button"
            onClick={() => { setMenu((v) => !v); setSearch(false); }}
            aria-label={menu ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menu}
            className="-mr-2 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`h-[2px] w-5 bg-text transition-transform ${menu ? "translate-y-[4px] rotate-45" : ""}`} />
            <span className={`h-[2px] w-5 bg-text transition-transform ${menu ? "-translate-y-[4px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {search && (
        <div className="absolute inset-x-0 top-full z-50 border-y border-rule bg-paper shadow-[0_12px_24px_-12px_rgba(0,0,0,0.15)]">
          <form action="/performances" className="container-x flex items-center gap-3 py-4" onSubmit={() => setSearch(false)}>
            <SearchIcon />
            <input name="q" autoFocus placeholder="공연명, 출연, 장소로 검색" className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-sub" />
            <button type="submit" className="bg-text px-5 py-2.5 font-display text-[12px] font-semibold tracking-[0.08em] text-paper">SEARCH</button>
          </form>
        </div>
      )}

      {menu && (
        <nav className="absolute inset-x-0 top-full z-50 border-y border-rule bg-paper md:hidden">
          <div className="container-x flex flex-col py-2">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="border-b border-rule py-4 font-display text-[15px] font-semibold tracking-[0.04em] last:border-0">
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
