import Link from "next/link";

/** 시안식 섹션 제목: 굵은 영문 제목 — 가는 선 — 한 줄 설명 ……… 오른쪽 링크 */
export function SectionTitle({ en, ko, href, more = "VIEW ALL" }: { en: string; ko: string; href?: string; more?: string }) {
  return (
    <div className="container-x mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 md:mb-10">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        <h2 className="font-display text-[24px] font-extrabold tracking-[-0.01em] md:text-[28px]">{en}</h2>
        <span className="hidden h-px w-12 bg-text/50 md:block" />
        <p className="text-[13.5px] text-sub">{ko}</p>
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-3 font-display text-[11px] font-bold tracking-[0.18em] hover:opacity-60">
          {more}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}
