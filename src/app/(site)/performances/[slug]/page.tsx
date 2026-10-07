import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/Countdown";
import { Poster } from "@/components/Poster";
import { StatusBadge } from "@/components/StatusBadge";
import { TicketButtons } from "@/components/TicketButtons";
import { getCompanies, getPerformance, getPerformances } from "@/lib/content";
import { formatDateRange, formatDateTime, getStatus, splitByTime } from "@/lib/status";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/performances/[slug]">): Promise<Metadata> {
  const p = await getPerformance((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: [p.subtitle, formatDateRange(p.startDate, p.endDate), p.venue].filter(Boolean).join(" · "),
    openGraph: p.poster ? { images: [p.poster] } : undefined,
  };
}

export default async function PerformancePage({ params }: PageProps<"/performances/[slug]">) {
  const { slug } = await params;
  const p = await getPerformance(slug);
  if (!p) notFound();

  const [companies, all] = await Promise.all([getCompanies(), getPerformances()]);
  const company = companies.find((c) => c.slug === p.company);
  const status = getStatus(p);

  // 공연 목록과 같은 순서로 이전·다음
  const { current, past } = splitByTime(all);
  const ordered = [...current, ...past];
  const i = ordered.findIndex((o) => o.slug === p.slug);
  const prev = ordered[i - 1];
  const next = ordered[i + 1];

  const info = [
    { k: "DATE", ko: "일시", v: [formatDateRange(p.startDate, p.endDate), p.timeText].filter(Boolean).join("\n") },
    { k: "VENUE", ko: "장소", v: p.venue },
    { k: "RATING", ko: "관람 등급", v: p.ageRating },
    { k: "RUNNING TIME", ko: "관람 시간", v: p.runningTime },
    { k: "PRICE", ko: "티켓 가격", v: p.price },
    { k: "PRESENTS", ko: "기획", v: company ? [company.name, company.nameEn].filter(Boolean).join(" · ") : undefined },
  ].filter((r) => r.v);

  return (
    <div className="pt-8 md:pt-12">
      <div className="container-x">
        <Link href="/performances" className="group inline-flex items-center gap-2 font-display text-[11px] font-bold tracking-[0.18em] hover:opacity-60">
          <span className="transition-transform group-hover:-translate-x-1">←</span> PROJECT
        </Link>
      </div>

      <div className="container-x mt-6 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
        <div className="flex items-center justify-center bg-soft px-[12%] py-[10%] md:sticky md:top-6 md:self-start">
          {p.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.poster} alt={`${p.title} 포스터`} className="block h-auto w-full max-w-[420px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)]" />
          ) : (
            <div className="aspect-[3/4] w-full max-w-[420px]">
              <Poster p={p} />
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={status} size="md" />
            {company && (
              <Link href={`/performances?company=${company.slug}`} className="font-display text-[11px] font-semibold tracking-[0.14em] text-sub hover:text-text">
                {company.nameEn ?? company.name}
              </Link>
            )}
          </div>
          <h1 className="mt-5 text-[28px] font-bold leading-[1.3] tracking-tight md:text-[36px]">{p.title}</h1>
          {p.subtitle && <p className="mt-2 text-[16px] text-sub">{p.subtitle}</p>}
          {p.artist && <p className="mt-1 text-[15px] font-semibold">{p.artist}</p>}

          <div className="mt-8 border border-text p-5 md:p-6">
            {status === "past" ? (
              <p className="text-[14px] text-sub">종료된 공연입니다. 함께해 주셔서 감사합니다.</p>
            ) : (
              <>
                <p className="font-display text-[11px] font-semibold tracking-[0.18em] text-sub">TICKET</p>
                {p.ticketOpenAt && (
                  <p className="mt-2 text-[17px] font-bold">
                    {status === "opensoon" ? "티켓 오픈 " : "티켓 오픈 완료 · "}
                    {formatDateTime(p.ticketOpenAt)}
                  </p>
                )}
                {status === "opensoon" && p.ticketOpenAt && (
                  <p className="mt-1 font-display text-3xl font-extrabold">
                    <Countdown to={p.ticketOpenAt} />
                  </p>
                )}
                <div className="mt-5">
                  {p.ticketLinks.length > 0 ? (
                    <TicketButtons links={p.ticketLinks} />
                  ) : (
                    <p className="text-[14px] text-sub">예매처와 오픈 일정은 곧 공개됩니다.</p>
                  )}
                </div>
              </>
            )}
          </div>

          <dl className="mt-10 divide-y divide-rule border-y border-rule">
            {info.map((r) => (
              <div key={r.k} className="grid grid-cols-[110px_1fr] gap-4 py-4 text-[14.5px] md:grid-cols-[130px_1fr]">
                <dt>
                  <span className="block font-display text-[10.5px] font-semibold tracking-[0.12em] text-sub">{r.k}</span>
                  <span className="text-[12px] text-sub">{r.ko}</span>
                </dt>
                <dd className="whitespace-pre-line">{r.v}</dd>
              </div>
            ))}
          </dl>

          {p.description && <p className="mt-10 whitespace-pre-line text-[15px] leading-[1.9]">{p.description}</p>}
        </div>
      </div>

      {p.detailImages.length > 0 && (
        <section className="mt-16 md:mt-24" aria-label="상세 정보">
          <h2 className="container-x mb-6 font-display text-[12px] font-bold tracking-[0.18em] md:text-center">DETAIL</h2>
          {/* 예매처 상세페이지처럼 이미지 사이 틈 없이 이어 붙인다 */}
          <div className="mx-auto max-w-[860px]">
            {p.detailImages.map((src, n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt={`${p.title} 상세 이미지 ${n + 1}`} loading="lazy" className="block h-auto w-full" />
            ))}
          </div>
        </section>
      )}

      {p.gallery.length > 0 && (
        <section className="container-x mt-16 md:mt-24">
          <h2 className="mb-6 font-display text-[12px] font-bold tracking-[0.18em]">GALLERY</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {p.gallery.map((src) => (
              <a key={src} href={src} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden bg-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${p.title} 사진`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </a>
            ))}
          </div>
        </section>
      )}

      <nav className="mt-16 border-t border-rule md:mt-24" aria-label="다른 공연">
        <div className="container-x grid h-20 grid-cols-3 items-center font-display text-[11px] font-bold tracking-[0.18em]">
          <div>{prev && <Link href={`/performances/${prev.slug}`} className="hover:opacity-60">← PREV</Link>}</div>
          <Link href="/performances" aria-label="공연 목록" className="justify-self-center hover:opacity-60">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-text" aria-hidden>
              {[3, 10, 17].flatMap((y) => [3, 10, 17].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" />))}
            </svg>
          </Link>
          <div className="justify-self-end">{next && <Link href={`/performances/${next.slug}`} className="hover:opacity-60">NEXT →</Link>}</div>
        </div>
      </nav>
    </div>
  );
}
