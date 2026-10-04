import Link from "next/link";

export function SectionTitle({ en, ko, href, more = "전체 보기" }: { en: string; ko: string; href?: string; more?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
      <div>
        <h2 className="font-display text-[28px] font-semibold leading-none tracking-tight md:text-5xl">{en}</h2>
        <p className="mt-3 text-sm text-muted md:text-base">{ko}</p>
      </div>
      {href && (
        <Link href={href} className="shrink-0 border-b border-fg/30 pb-1 text-sm text-fg/80 transition-colors hover:border-pink hover:text-pink">
          {more} →
        </Link>
      )}
    </div>
  );
}
