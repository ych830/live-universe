import { HeroPanels, ScrollLine } from "@/components/HeroPanels";
import { Orbit } from "@/components/Orbit";
import { PosterTile } from "@/components/Poster";
import { SectionTitle } from "@/components/SectionTitle";
import { getCompanies, getPerformances } from "@/lib/content";
import { SITE } from "@/lib/site";
import { getStatus, splitByTime } from "@/lib/status";

export const revalidate = 60;

export default async function Home() {
  const [performances, companies] = await Promise.all([getPerformances(), getCompanies()]);
  const companyOf = (slug?: string) => companies.find((c) => c.slug === slug);
  const { current, past } = splitByTime(performances);

  return (
    <>
      {/* '첫 화면 맨 앞에' 체크한 공연이 먼저, 나머지는 날짜순 */}
      <HeroPanels
        items={[...current]
          .sort((a, b) => Number(b.featured) - Number(a.featured))
          .map((p) => ({ p, status: getStatus(p), companyName: companyOf(p.company)?.nameEn }))}
      />

      {past.length > 0 && (
        <section className="pb-20 md:pb-28">
          <ScrollLine />
          <SectionTitle en="ARCHIVE" ko="라이브유니버스가 만든 공연들" href="/performances?status=past" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {past.slice(0, 15).map((p) => (
              <PosterTile key={p.slug} p={p} company={companyOf(p.company)} />
            ))}
          </div>
        </section>
      )}

      <section id="about" className="scroll-mt-14 border-t border-white/20 py-20 md:py-28">
        <div className="container-x grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <p className="font-display text-sm font-semibold tracking-[0.14em] text-white/75">ABOUT</p>
            <h2 className="mt-5 text-[32px] font-bold leading-[1.25] tracking-tight md:text-5xl">
              모든 라이브는
              <br />
              하나의 우주가 된다.
            </h2>
            <p className="mt-8 max-w-lg text-[15px] leading-[1.9] text-white/85 md:text-base">
              {SITE.nameKo}는 페스티벌, 단독 콘서트, 클럽 공연을 만드는 계열사들이 모인 공연 그룹입니다. 아티스트가 그리는 세계를 무대로
              옮기고, 관객이 그 안에서 잊지 못할 밤을 보내도록 기획부터 현장 운영까지 함께합니다.
            </p>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/25 pt-8">
              {[
                { k: "PERFORMANCES", v: performances.length },
                { k: "COMPANIES", v: companies.length },
                { k: "ON STAGE", v: current.length },
              ].map((s) => (
                <div key={s.k} className="flex flex-col-reverse">
                  <dt className="mt-2 font-display text-[10px] font-semibold tracking-[0.12em] text-white/70">{s.k}</dt>
                  <dd className="font-display text-4xl font-extrabold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Orbit companies={companies} />
        </div>
      </section>

      <section id="contact" className="scroll-mt-14 border-t border-white/20 py-20 md:py-28">
        <div className="container-x">
          <h2 className="font-display text-4xl font-medium leading-[1.15] md:text-6xl">
            HELLO,
            <br />
            WE ARE LIVE UNIVERSE
          </h2>
          <p className="mt-4 font-display text-sm tracking-[0.06em] text-white/75">LIVE UNIVERSE IS A CONCERT CREATIVE GROUP.</p>
          <ul className="mt-12 space-y-6 text-[15px] md:text-base">
            <li className="flex items-center gap-5">
              <MailIcon />
              <a href={`mailto:${SITE.email}`} className="border-b border-white/40 pb-0.5 hover:border-white">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-5">
              <PhoneIcon />
              <a href={`tel:${SITE.phone.replace(/[^0-9+]/g, "")}`} className="hover:opacity-80">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-5">
              <PinIcon />
              <span>{SITE.address}</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

const iconCls = "h-7 w-7 shrink-0 fill-none stroke-white stroke-[1.5]";
const MailIcon = () => (
  <svg viewBox="0 0 24 24" className={iconCls} aria-hidden>
    <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
    <path d="m3 6 9 7 9-7" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className={iconCls} aria-hidden>
    <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" className={iconCls} aria-hidden>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
