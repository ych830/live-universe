import Link from "next/link";
import { getCompanies } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

export async function Footer() {
  const companies = await getCompanies();
  return (
    <footer className="border-t border-line bg-panel/40">
      <div className="container-x grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{SITE.description}</p>
          <div className="mt-6 flex gap-4 font-display text-[11px] tracking-[0.14em] text-fg/70">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-pink">INSTAGRAM</a>
            <a href={SITE.youtube} target="_blank" rel="noreferrer" className="hover:text-pink">YOUTUBE</a>
          </div>
        </div>
        <div>
          <h3 className="font-display text-[11px] tracking-[0.18em] text-muted">FAMILY</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {companies.map((c) => (
              <li key={c.slug}>
                <Link href={`/performances?company=${c.slug}`} className="text-fg/80 hover:text-fg">
                  {c.nameEn ?? c.name}
                  <span className="ml-2 text-muted">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-[11px] tracking-[0.18em] text-muted">CONTACT</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-fg/80">
            <li><a href={`mailto:${SITE.email}`} className="hover:text-fg">{SITE.email}</a></li>
            <li>{SITE.phone}</li>
            <li>{SITE.address}</li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-xs text-muted md:flex-row md:justify-between">
        <p>
          {SITE.nameKo} · 대표 {SITE.ceo} · 사업자등록번호 {SITE.bizNo}
        </p>
        <p className="font-display tracking-wider">© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  );
}
