import { Carousel } from "@/components/Carousel";
import { FeaturedHero } from "@/components/FeaturedHero";
import { Orbit } from "@/components/Orbit";
import { ArchiveTile, PosterCard } from "@/components/Poster";
import { SectionTitle } from "@/components/SectionTitle";
import { getCompanies, getPerformances } from "@/lib/content";
import { pickHero, splitFeatured } from "@/lib/select";
import { SITE } from "@/lib/site";
import { splitByTime } from "@/lib/status";

export const revalidate = 60;

export default async function Home() {
  const [performances, companies] = await Promise.all([getPerformances(), getCompanies()]);
  const hero = pickHero(performances);
  const { featured, archive } = splitFeatured(performances);
  const { current } = splitByTime(performances);
  const heroCompany = companies.find((c) => c.slug === hero?.company);

  return (
    <>
      <FeaturedHero p={hero} companyName={heroCompany?.nameEn ?? heroCompany?.name} />

      {featured.length > 0 && (
        <section className="py-16 md:py-24">
          <SectionTitle en="FEATURED PERFORMANCES" ko="지금, 가장 특별한 무대들을 소개합니다." href="/performances" more="ALL PROJECTS" />
          <div className="container-x">
            <Carousel>
              {featured.map((p) => (
                <PosterCard key={p.slug} p={p} showStatus className="w-[42%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-96px)/5)]" />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {archive.length > 0 && (
        <section className="bg-soft py-16 md:py-24">
          <SectionTitle en="ARCHIVE" ko="지나온 무대들이 만들어낸 또 하나의 우주." href="/performances?status=past" />
          <div className="container-x grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
            {archive.slice(0, 18).map((p) => (
              <ArchiveTile key={p.slug} p={p} />
            ))}
          </div>
        </section>
      )}

      <section id="about" className="scroll-mt-4 overflow-x-clip py-16 md:py-24">
        <div className="container-x grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <p className="flex items-center gap-4 font-display text-[11px] font-semibold tracking-[0.2em]">
              ABOUT <span className="h-px w-12 bg-text/50" />
            </p>
            <h2 className="mt-6 text-[30px] font-bold leading-[1.3] tracking-tight md:text-[42px]">
              모든 라이브는
              <br />
              하나의 우주가 된다.
            </h2>
            <p className="mt-7 max-w-lg text-[15px] leading-[1.9] text-sub">
              {SITE.nameKo}는 페스티벌, 단독 콘서트, 클럽 공연을 만드는 계열사들이 모인 공연 그룹입니다. 아티스트가 그리는 세계를 무대로
              옮기고, 관객이 그 안에서 잊지 못할 밤을 보내도록 기획부터 현장 운영까지 함께합니다.
            </p>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-rule pt-8">
              {[
                { k: "PERFORMANCES", v: performances.length },
                { k: "COMPANIES", v: companies.length },
                { k: "UPCOMING", v: current.length },
              ].map((s) => (
                <div key={s.k} className="flex flex-col-reverse">
                  <dt className="mt-2 font-display text-[10px] font-semibold tracking-[0.12em] text-sub">{s.k}</dt>
                  <dd className="font-display text-4xl font-extrabold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Orbit companies={companies} />
        </div>
      </section>

      <section id="contact" className="scroll-mt-4 bg-brand py-16 text-brand-ink md:py-24">
        <div className="container-x grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <h2 className="font-display text-[38px] font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[56px]">
              HELLO,
              <br />
              WE ARE LIVE UNIVERSE
            </h2>
            <p className="mt-4 font-display text-[12px] font-medium tracking-[0.12em] opacity-80">CONCERT CREATIVE GROUP</p>
          </div>
          <div>
            <p className="text-[14px] font-semibold opacity-80">공연 기획 · 협업 · 대관 문의</p>
            <ul className="mt-5 space-y-4 text-[15px] md:text-base">
              <li className="flex items-center gap-4">
                <MailIcon />
                <a href={`mailto:${SITE.email}`} className="border-b border-current pb-0.5 hover:opacity-70">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <PhoneIcon />
                <a href={`tel:${SITE.phone.replace(/[^0-9+]/g, "")}`} className="hover:opacity-70">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <PinIcon />
                <span>{SITE.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

const iconCls = "h-6 w-6 shrink-0 fill-none stroke-current stroke-[1.6]";
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
