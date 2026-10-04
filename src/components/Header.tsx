"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/performances", en: "PERFORMANCE", ko: "공연" },
  { href: "/companies", en: "COMPANIES", ko: "계열사" },
  { href: "/#about", en: "ABOUT", ko: "소개" },
  { href: "/#contact", en: "CONTACT", ko: "문의" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="LIVE UNIVERSE 홈">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href) && !n.href.includes("#");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`group relative font-display text-[12px] tracking-[0.14em] transition-colors hover:text-fg ${active ? "text-fg" : "text-fg/65"}`}
              >
                {n.en}
                <span className={`absolute -bottom-1.5 left-0 h-px bg-pink transition-all ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="-mr-2 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px w-6 bg-fg transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-fg transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <nav className="container-x flex flex-col pb-6 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b border-line py-4">
              <span className="font-display text-xl tracking-wide">{n.en}</span>
              <span className="text-sm text-muted">{n.ko}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
