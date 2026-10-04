import Link from "next/link";
import { formatDateRange, getStatus } from "@/lib/status";
import type { Company, Performance } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function Poster({ p, className = "" }: { p: Performance; className?: string }) {
  return p.poster ? (
    // eslint-disable-next-line @next/next/no-img-element -- 업로드 이미지 도메인이 정해져 있지 않아 일반 img 사용
    <img src={p.poster} alt={`${p.title} 포스터`} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`flex h-full w-full items-end bg-gradient-to-br from-panel-2 to-violet/30 p-4 ${className}`}>
      <span className="font-display text-lg leading-tight">{p.title}</span>
    </div>
  );
}

export function PosterCard({ p, company }: { p: Performance; company?: Company }) {
  const status = getStatus(p);
  return (
    <Link href={`/performances/${p.slug}`} className="group block">
      <div className="relative aspect-[5/7] overflow-hidden rounded-md bg-panel">
        <Poster p={p} className="transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute left-3 top-3">
          <StatusBadge status={status} />
        </div>
        <span className="absolute bottom-3 right-3 translate-y-2 font-display text-[10px] tracking-[0.16em] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          VIEW →
        </span>
      </div>
      <div className="mt-4 space-y-1.5">
        {company && <p className="font-display text-[10px] tracking-[0.16em] text-violet">{company.nameEn ?? company.name}</p>}
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug group-hover:text-pink md:text-base">{p.title}</h3>
        <p className="text-[13px] text-muted">{formatDateRange(p.startDate, p.endDate)}</p>
        {p.venue && <p className="text-[13px] text-muted">{p.venue}</p>}
      </div>
    </Link>
  );
}
