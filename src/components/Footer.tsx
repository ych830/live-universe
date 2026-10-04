import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/20">
      <div className="container-x flex flex-col items-center gap-4 py-12 text-center text-xs text-white/70">
        <Logo className="text-white" />
        <p>
          {SITE.nameKo} · 대표 {SITE.ceo} · 사업자등록번호 {SITE.bizNo}
          <br />
          {SITE.address} · {SITE.phone} · {SITE.email}
        </p>
        <div className="flex gap-5 font-display text-[11px] font-semibold tracking-[0.12em] text-white">
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:opacity-70">INSTAGRAM</a>
          <a href={SITE.youtube} target="_blank" rel="noreferrer" className="hover:opacity-70">YOUTUBE</a>
        </div>
        <p className="font-display">© {new Date().getFullYear()} {SITE.name}. All Rights Reserved</p>
      </div>
    </footer>
  );
}
