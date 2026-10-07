import Link from "next/link";
import { formatDateCompact, getStatus } from "@/lib/status";
import type { Performance } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function Poster({ p, className = "" }: { p: Performance; className?: string }) {
  return p.poster ? (
    // eslint-disable-next-line @next/next/no-img-element -- 업로드 이미지 도메인이 정해져 있지 않아 일반 img 사용
    <img src={p.poster} alt={`${p.title} 포스터`} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`flex h-full w-full items-end bg-soft p-4 ${className}`}>
      <span className="font-display text-lg font-bold leading-tight">{p.title}</span>
    </div>
  );
}

/** 포스터 + 아래 공연명 · 날짜 | 장소 (시안의 FEATURED PERFORMANCES 카드) */
export function PosterCard({ p, showStatus = false, className = "" }: { p: Performance; showStatus?: boolean; className?: string }) {
  const status = getStatus(p);
  return (
    <Link href={`/performances/${p.slug}`} className={`group block ${className}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-soft shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <Poster p={p} className="transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        {showStatus && status !== "past" && (
          <div className="absolute left-2 top-2">
            <StatusBadge status={status} />
          </div>
        )}
      </div>
      <h3 className="mt-3 truncate text-[14.5px] font-bold group-hover:underline md:text-[15px]">{p.title}</h3>
      <p className="mt-1 truncate text-[12.5px] text-sub">
        {formatDateCompact(p.startDate, p.endDate)}
        {p.venue && (
          <>
            <span className="mx-2 text-rule">|</span>
            {p.venue}
          </>
        )}
      </p>
    </Link>
  );
}

/** ARCHIVE 의 작은 포스터 — 마우스를 올리면 공연명 */
export function ArchiveTile({ p }: { p: Performance }) {
  return (
    <Link href={`/performances/${p.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-paper shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <Poster p={p} className="transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-text/75 p-2 text-center text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <p className="line-clamp-3 text-[12px] font-bold leading-snug">{p.title}</p>
        <p className="mt-1 text-[10.5px] text-paper/75">{formatDateCompact(p.startDate)}</p>
      </div>
    </Link>
  );
}
