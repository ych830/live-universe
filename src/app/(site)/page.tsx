import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import { Marquee } from "@/components/Marquee";
import { Orbit } from "@/components/Orbit";
import { Poster, PosterCard } from "@/components/PosterCard";
import { SectionTitle } from "@/components/SectionTitle";
import { StatusBadge } from "@/components/StatusBadge";
import { TicketButtons } from "@/components/TicketButtons";
import { getCompanies, getPerformances } from "@/lib/content";
import { SITE } from "@/lib/site";
import { formatDateRange, formatDateTime, getStatus, splitByTime } from "@/lib/status";

export const revalidate = 60;

export default async function Home() {
  const [performances, companies] = await Promise.all([getPerformances(), getCompanies()]);
  const companyOf = (slug?: string) => companies.find((c) => c.slug === slug);
  const { current, past } = splitByTime(performances);

  const featured = current.filter((p) => p.featured);
  const slides: HeroSlide[] = (featured.length ? featured : current.slice(0, 3)).map((p) => ({
    p,
    status: getStatus(p),
    companyName: companyOf(p.company)?.nameEn,
    dateText: formatDateRange(p.startDate, p.endDate),
    openText: p.ticketOpenAt ? formatDateTime(p.ticketOpenAt) : undefined,
  }));

  return (
    <>
      {slides.length > 0 ? (
        <HeroSlider slides={slides} />
      ) : (
        <section className="container-x flex min-h-[80svh] flex-col justify-center pt-24">
          <h1 className="font-display text-5xl font-extrabold leading-none md:text-8xl">
            WE MAKE
            <br />
            <span className="text-gradient">LIVE MOMENTS</span>
          </h1>
        </section>
      )}

      <Marquee words={["LIVE UNIVERSE", "CONCERT", "FESTIVAL", "TOUR", "라이브유니버스"]} />

      {current.length > 0 && (
        <section className="container-x py-20 md:py-32">
          <SectionTitle en="NOW & NEXT" ko="지금 예매 중이거나 곧 열리는 공연" href="/performances" />
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {current.map((p) => {
              const status = getStatus(p);
              return (
                <article key={p.slug} className="group flex gap-4 rounded-xl border border-line bg-panel/60 p-3 transition-colors hover:border-fg/25 md:gap-6 md:p-4">
                  <Link href={`/performances/${p.slug}`} className="aspect-[5/7] w-28 shrink-0 overflow-hidden rounded-md md:w-36">
                    <Poster p={p} className="transition-transform duration-500 group-hover:scale-105" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={status} />
                      {companyOf(p.company) && (
                        <span className="font-display text-[9.5px] tracking-[0.14em] text-violet">{companyOf(p.company)!.nameEn}</span>
                      )}
                    </div>
                    <Link href={`/performances/${p.slug}`}>
                      <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug hover:text-pink md:text-lg">{p.title}</h3>
                    </Link>
                    <p className="mt-1.5 text-[13px] text-muted">{formatDateRange(p.startDate, p.endDate)}</p>
                    {p.venue && <p className="text-[13px] text-muted">{p.venue}</p>}
                    <div className="mt-auto pt-4">
                      {status === "opensoon" && p.ticketOpenAt && (
                        <p className="mb-3 text-[13px]">
                          <span className="text-lime">티켓 오픈</span> {formatDateTime(p.ticketOpenAt)}
                          <Countdown to={p.ticketOpenAt} className="block text-lime md:ml-2 md:inline" />
                        </p>
                      )}
                      {p.ticketLinks.length > 0 ? (
                        <TicketButtons links={p.ticketLinks} size="sm" />
                      ) : (
                        <p className="text-[13px] text-muted">예매 일정은 곧 공개됩니다</p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section id="about" className="scroll-mt-20 border-y border-line bg-panel/30 py-20 md:py-32">
        <div className="container-x grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <p className="font-display text-[11px] tracking-[0.2em] text-pink">ABOUT US</p>
            <h2 className="mt-6 text-[32px] font-bold leading-[1.25] tracking-tight md:text-5xl">
              모든 라이브는
              <br />
              <span className="text-gradient">하나의 우주</span>가 된다.
            </h2>
            <p className="mt-8 max-w-lg text-[15px] leading-[1.9] text-fg/75 md:text-base">
              {SITE.nameKo}는 페스티벌, 단독 콘서트, 클럽 공연을 만드는 계열사들이 모인 공연 그룹입니다. 아티스트가 그리는 세계를 무대로
              옮기고, 관객이 그 안에서 잊지 못할 밤을 보내도록 기획부터 현장 운영까지 함께합니다.
            </p>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8">
              {[
                { k: "PERFORMANCES", v: performances.length },
                { k: "COMPANIES", v: companies.length },
                { k: "ON STAGE", v: current.length },
              ].map((s) => (
                <div key={s.k}>
                  <dd className="font-display text-3xl font-semibold md:text-4xl">{s.v}</dd>
                  <dt className="mt-2 font-display text-[9.5px] tracking-[0.14em] text-muted">{s.k}</dt>
                </div>
              ))}
            </dl>
          </div>
          <Orbit companies={companies} />
        </div>
      </section>

      {past.length > 0 && (
        <section className="container-x py-20 md:py-32">
          <SectionTitle en="ARCHIVE" ko="우리가 만든 공연들" href="/performances?status=past" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
            {past.slice(0, 8).map((p) => (
              <PosterCard key={p.slug} p={p} company={companyOf(p.company)} />
            ))}
          </div>
        </section>
      )}

      <section id="contact" className="scroll-mt-20 border-t border-line">
        <div className="container-x py-20 md:py-32">
          <p className="font-display text-[11px] tracking-[0.2em] text-pink">CONTACT</p>
          <h2 className="mt-6 text-[28px] font-bold leading-tight md:text-5xl">공연 기획 · 협업 · 대관 문의</h2>
          <a href={`mailto:${SITE.email}`} className="group mt-10 inline-flex items-center gap-4 font-display text-2xl font-semibold tracking-tight md:text-6xl">
            <span className="border-b-2 border-fg/20 pb-1 transition-colors group-hover:border-pink group-hover:text-pink">{SITE.email}</span>
            <span className="transition-transform group-hover:translate-x-2">→</span>
          </a>
          <p className="mt-6 text-sm text-muted">{SITE.phone}</p>
        </div>
      </section>
    </>
  );
}
