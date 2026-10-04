import Link from "next/link";
import { formatDateRange, getStatus } from "@/lib/status";
import type { Company, Performance } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function Poster({ p, className = "" }: { p: Performance; className?: string }) {
  return p.poster ? (
    // eslint-disable-next-line @next/next/no-img-element -- 업로드 이미지 도메인이 정해져 있지 않아 일반 img 사용
    <img src={p.poster} alt={`${p.title} 포스터`} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`flex h-full w-full items-end bg-cobalt-deep p-4 ${className}`}>
      <span className="font-display text-lg font-bold leading-tight">{p.title}</span>
    </div>
  );
}

/** 아르떼잇식: 포스터 색이 번진 거친 배경 위에 흰 액자 포스터 */
export function PosterStage({ p, children, className = "" }: { p: Performance; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative isolate overflow-hidden bg-black ${className}`}>
      {p.poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.poster} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full scale-150 object-cover opacity-70 blur-2xl" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/35 to-black/75" />
      <div className="grain absolute inset-0 -z-10 opacity-40" />
      <span className="absolute left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 whitespace-nowrap font-display text-[11px] tracking-[0.3em] text-white/50 md:block">
        LIVE UNIVERSE
      </span>
      {children}
    </div>
  );
}

export function FramedPoster({ p, className = "" }: { p: Performance; className?: string }) {
  return (
    <div className={`bg-white p-1.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] md:p-2 ${className}`}>
      <div className="aspect-[5/7] overflow-hidden">
        <Poster p={p} />
      </div>
    </div>
  );
}

/** 일레븐식 꽉 찬 타일 — 마우스를 올리면 어두워지며 공연명이 뜬다 */
export function PosterTile({ p, company, showStatus = false }: { p: Performance; company?: Company; showStatus?: boolean }) {
  return (
    <Link href={`/performances/${p.slug}`} className="group relative block aspect-[5/7] overflow-hidden bg-cobalt-deep">
      <Poster p={p} className="transition-transform duration-700 ease-out group-hover:scale-105" />
      {showStatus && (
        <div className="absolute left-2 top-2">
          <StatusBadge status={getStatus(p)} />
        </div>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <p className="font-display text-base font-bold uppercase leading-tight md:text-lg">{p.title}</p>
        <p className="mt-2 text-[13px] text-white/80">{formatDateRange(p.startDate, p.endDate)}</p>
        {company && <p className="mt-1 font-display text-[11px] tracking-[0.12em] text-white/70">{company.nameEn ?? company.name}</p>}
      </div>
    </Link>
  );
}
