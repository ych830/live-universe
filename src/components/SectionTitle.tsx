import Link from "next/link";

export function SectionTitle({ en, ko, href, more = "전체 보기" }: { en: string; ko: string; href?: string; more?: string }) {
  return (
    <div className="container-x mb-8 flex flex-col items-center text-center md:mb-12">
      <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">{en}</h2>
      <p className="mt-2 text-sm text-white/75 md:text-base">{ko}</p>
      {href && (
        <Link href={href} className="mt-4 border-b border-white/50 pb-0.5 text-[13px] hover:border-white">
          {more} →
        </Link>
      )}
    </div>
  );
}
