import Link from "next/link";
import { formatDateRange, formatDateTime, type Status } from "@/lib/status";
import type { Performance } from "@/lib/types";
import { Countdown } from "./Countdown";
import { FramedPoster, PosterStage } from "./Poster";
import { StatusBadge } from "./StatusBadge";
import { TicketButtons } from "./TicketButtons";

export interface PanelItem {
  p: Performance;
  status: Status;
  companyName?: string;
}

/** 첫 화면: 예매 중·오픈 예정 공연을 아르떼잇식 세로 패널로 (4개 넘으면 옆으로 넘김) */
export function HeroPanels({ items }: { items: PanelItem[] }) {
  if (items.length === 0) {
    return (
      <section className="flex h-[calc(100svh-188px)] min-h-[420px] flex-col items-center justify-center px-4 text-center md:h-[calc(100svh-220px)]">
        <p className="font-display text-4xl font-extrabold md:text-7xl">NEXT SHOW</p>
        <p className="mt-3 text-white/80">다음 공연을 준비하고 있어요</p>
      </section>
    );
  }
  return (
    <section aria-label="예매 중·오픈 예정 공연" className="h-[calc(100svh-188px)] min-h-[540px] md:h-[calc(100svh-220px)] md:min-h-[600px]">
      <div className="flex h-full snap-x snap-mandatory gap-1 overflow-x-auto [scrollbar-width:none]">
        {items.map(({ p, status, companyName }) => (
          <PosterStage key={p.slug} p={p} className="group h-full w-[84vw] shrink-0 snap-start md:w-auto md:min-w-[calc(25%-3px)] md:flex-1">
            <Link href={`/performances/${p.slug}`} aria-label={`${p.title} 상세 보기`} className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
            <div className="pointer-events-none flex h-full flex-col items-center px-6 pb-6 pt-[8%] md:px-8 md:pb-8">
              <div className="aspect-[5/7] h-[52%] transition-transform duration-500 group-hover:-translate-y-1.5 md:h-[56%]">
                <FramedPoster p={p} />
              </div>
              <div className="mt-auto w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={status} />
                  {companyName && <span className="font-display text-[10px] font-semibold tracking-[0.14em] text-white/75">{companyName}</span>}
                </div>
                <h2 className="mt-3 line-clamp-2 font-display text-lg font-bold uppercase leading-tight md:text-[22px]">{p.title}</h2>
                <p className="mt-1.5 text-[13px] text-white/80">
                  {formatDateRange(p.startDate, p.endDate)}
                  {p.venue && ` · ${p.venue}`}
                </p>
                {status === "opensoon" && p.ticketOpenAt && (
                  <p className="mt-2 text-[13px] font-semibold">
                    티켓 오픈 {formatDateTime(p.ticketOpenAt)}
                    <Countdown to={p.ticketOpenAt} className="ml-2 font-display" />
                  </p>
                )}
                <div className="pointer-events-auto mt-4">
                  {p.ticketLinks.length > 0 ? (
                    <TicketButtons links={p.ticketLinks.slice(0, 1)} size="sm" />
                  ) : (
                    <p className="text-[13px] text-white/70">예매 일정은 곧 공개됩니다</p>
                  )}
                </div>
              </div>
            </div>
          </PosterStage>
        ))}
      </div>
    </section>
  );
}

/** 일레븐식 스크롤 안내 세로선 */
export function ScrollLine() {
  return (
    <div className="flex justify-center py-10 md:py-14" aria-hidden>
      <span className="block h-16 w-px animate-drop bg-white md:h-24" />
    </div>
  );
}
