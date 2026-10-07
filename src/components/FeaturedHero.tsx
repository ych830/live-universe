import Link from "next/link";
import { formatDateRange, formatDateTime, getStatus } from "@/lib/status";
import type { Performance } from "@/lib/types";
import { Countdown } from "./Countdown";
import { Poster } from "./Poster";
import { StatusBadge } from "./StatusBadge";
import { TicketButtons } from "./TicketButtons";

/** 첫 화면: 색 띠 위에 왼쪽 브랜드 문구 · 가운데 대표 포스터 · 오른쪽 공연 정보 */
export function FeaturedHero({ p, companyName }: { p?: Performance; companyName?: string }) {
  const status = p ? getStatus(p) : undefined;
  const ticketing = p && status !== "past" && p.ticketLinks.length > 0;

  return (
    <section className="bg-brand text-brand-ink">
      {/* 세 칸(브랜드 문구 · 대표 포스터 · 공연 정보)을 띠 안에서 세로 가운데 정렬. 포스터는 띠 밖으로 나가지 않는다 */}
      <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-[1fr_300px_1fr] lg:gap-14 lg:py-16">
        <div>
          <p className="font-display text-[10.5px] font-medium leading-[2] tracking-[0.5em] opacity-80">
            MUSIC CREATES
            <br />
            ANOTHER UNIVERSE
          </p>
          <h1 className="mt-3 font-display text-[50px] font-extrabold leading-[0.95] tracking-[-0.02em] md:text-[60px]">
            LIVE
            <br />
            UNIVERSE
          </h1>
          <p className="mt-5 flex items-center gap-4 text-[16px] font-bold md:text-[17px]">
            <span className="h-[2px] w-12 bg-current" />
            음악이 만드는, 또 하나의 우주
          </p>
          <p className="mt-5 text-[14.5px] leading-[1.75] opacity-90">
            라이브유니버스는
            <br />
            사람과 음악이 만나는 특별한 순간을 기획하는
            <br />
            공연 크리에이티브 그룹입니다.
          </p>
          <Link href="/#about" className="group mt-7 inline-flex items-center gap-3 font-display text-[11px] font-bold tracking-[0.2em]">
            OUR STORY <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {p ? (
          <Link
            href={`/performances/${p.slug}`}
            className="mx-auto block w-[70%] max-w-[300px] shadow-[0_20px_40px_-14px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:-translate-y-1 lg:w-full"
          >
            {p.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.poster} alt={`${p.title} 포스터`} className="block h-auto w-full" />
            ) : (
              <div className="aspect-[3/4]">
                <Poster p={p} />
              </div>
            )}
          </Link>
        ) : (
          <div />
        )}

        {p && status && (
          <div>
            <p className="flex items-center gap-4 font-display text-[11px] font-semibold tracking-[0.2em]">
              FEATURED <span className="h-px w-14 bg-current opacity-60" />
            </p>
            {status !== "past" && (
              <div className="mt-5">
                <StatusBadge status={status} />
              </div>
            )}
            <h2 className="mt-4 text-[26px] font-bold leading-[1.35] md:text-[30px]">{p.title}</h2>
            {p.subtitle && <p className="mt-2 text-[14px] opacity-80">{p.subtitle}</p>}
            <dl className="mt-7 grid grid-cols-[88px_1fr] gap-y-3 text-[13.5px]">
              {p.venue && (
                <>
                  <dt className="font-display text-[10.5px] tracking-[0.1em] opacity-70">VENUE</dt>
                  <dd>{p.venue}</dd>
                </>
              )}
              <dt className="font-display text-[10.5px] tracking-[0.1em] opacity-70">DATE</dt>
              <dd>{formatDateRange(p.startDate, p.endDate)}</dd>
              {companyName && (
                <>
                  <dt className="font-display text-[10.5px] tracking-[0.1em] opacity-70">PRESENTS</dt>
                  <dd>{companyName}</dd>
                </>
              )}
              {status === "opensoon" && p.ticketOpenAt && (
                <>
                  <dt className="font-display text-[10.5px] tracking-[0.1em] opacity-70">TICKET</dt>
                  <dd className="font-semibold">
                    {formatDateTime(p.ticketOpenAt)} 오픈
                    <Countdown to={p.ticketOpenAt} className="block font-display" />
                  </dd>
                </>
              )}
            </dl>
            <div className="mt-8 flex flex-wrap gap-2">
              {ticketing && <TicketButtons links={p.ticketLinks.slice(0, 1)} />}
              <Link
                href={`/performances/${p.slug}`}
                className={`group inline-flex items-center gap-4 px-5 py-3 font-display text-[12px] font-bold tracking-[0.16em] transition-colors ${
                  ticketing ? "border border-current hover:border-text hover:bg-text hover:text-paper" : "bg-text text-paper hover:bg-paper hover:text-text"
                }`}
              >
                VIEW MORE <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
