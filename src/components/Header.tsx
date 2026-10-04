"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BigLogo } from "./Logo";

const NAV = [
  { href: "/performances", label: "Performance" },
  { href: "/companies", label: "Companies" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

/** 가운데 큰 로고는 스크롤과 함께 올라가고, 메뉴 띠만 위에 붙는다 */
export function Header() {
  const pathname = usePathname();
  return (
    <>
      <div className="flex justify-center pb-5 pt-9 md:pb-6 md:pt-12">
        <Link href="/" aria-label="LIVE UNIVERSE 홈">
          <BigLogo />
        </Link>
      </div>
      <nav className="sticky top-0 z-50 bg-cobalt/95 backdrop-blur">
        <ul className="flex h-14 items-center justify-center gap-6 md:gap-12">
          {NAV.map((n) => {
            const active = !n.href.includes("#") && pathname.startsWith(n.href);
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`relative py-2 font-display text-[13px] font-medium transition-opacity md:text-sm ${active ? "opacity-100" : "opacity-75 hover:opacity-100"}`}
                >
                  {n.label}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all ${active ? "w-full" : "w-0"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
