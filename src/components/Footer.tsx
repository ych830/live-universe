import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-text text-paper">
      <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-6 text-[12.5px] leading-[1.8] text-paper/60">
            {SITE.nameKo} · 대표 {SITE.ceo} · 사업자등록번호 {SITE.bizNo}
            <br />
            {SITE.address} · {SITE.phone} · {SITE.email}
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex gap-6 font-display text-[11px] font-semibold tracking-[0.16em]">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-brand">INSTAGRAM</a>
            <a href={SITE.youtube} target="_blank" rel="noreferrer" className="hover:text-brand">YOUTUBE</a>
          </div>
          <p className="font-display text-[11px] text-paper/50">© {new Date().getFullYear()} {SITE.name}. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
