import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/Countdown";
import { FramedPoster, PosterStage } from "@/components/Poster";
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
    { k: "일시", v: [formatDateRange(p.startDate, p.endDate), p.timeText].filter(Boolean).join("\n") },
    { k: "장소", v: p.venue },
    { k: "관람 등급", v: p.ageRating },
    { k: "관람 시간", v: p.runningTime },
    { k: "티켓 가격", v: p.price },
    { k: "기획", v: company ? [company.name, company.nameEn].filter(Boolean).join(" · ") : undefined },
  ].filter((r) => r.v);

  return (
    <div className="pt-8 md:pt-14">
      <div className="container-x grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
        <PosterStage p={p} className="flex aspect-[6/5] items-center justify-center md:sticky md:top-20 md:self-start">
          <div className="aspect-[5/7] h-[80%]">
            <FramedPoster p={p} />
          </div>
        </PosterStage>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={status} size="md" />
            {company && (
              <Link href={`/performances?company=${company.slug}`} className="font-display text-xs font-semibold tracking-[0.12em] text-white/80 hover:text-white">
                {company.nameEn ?? company.name}
              </Link>
            )}
          </div>
          <h1 className="mt-5 font-display text-[28px] font-bold uppercase leading-[1.2] md:text-[40px]">{p.title}</h1>
          {p.subtitle && <p className="mt-3 text-lg text-white/90">{p.subtitle}</p>}
          {p.artist && <p className="mt-2 text-[15px] text-white/70">{p.artist}</p>}

          <div className="mt-8 border border-white/30 bg-space-deep/70 p-5 backdrop-blur-sm md:p-6">
            {status === "past" ? (
              <p className="text-sm text-white/80">종료된 공연입니다. 함께해 주셔서 감사합니다.</p>
            ) : (
              <>
                <p className="font-display text-xs font-semibold tracking-[0.14em] text-white/70">TICKET</p>
                {p.ticketOpenAt && (
                  <p className="mt-2 text-lg font-semibold">
                    {status === "opensoon" ? "티켓 오픈 " : "티켓 오픈 완료 · "}
                    {formatDateTime(p.ticketOpenAt)}
                  </p>
                )}
                {status === "opensoon" && p.ticketOpenAt && (
                  <p className="mt-1 font-display text-3xl font-bold">
                    <Countdown to={p.ticketOpenAt} />
                  </p>
                )}
                <div className="mt-5">
                  {p.ticketLinks.length > 0 ? (
                    <TicketButtons links={p.ticketLinks} />
                  ) : (
                    <p className="text-sm text-white/80">예매처와 오픈 일정은 곧 공개됩니다.</p>
                  )}
                </div>
              </>
            )}
          </div>

          <dl className="mt-10 space-y-5">
            {info.map((r) => (
              <div key={r.k}>
                <dt className="font-display text-[15px] font-semibold">{r.k}</dt>
                <dd className="mt-1 whitespace-pre-line text-[15px] text-white/75">{r.v}</dd>
              </div>
            ))}
          </dl>

          {p.description && <p className="mt-10 whitespace-pre-line text-[15px] leading-[1.9] text-white/90">{p.description}</p>}
        </div>
      </div>

      {p.gallery.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="container-x mb-6 font-display text-sm font-semibold tracking-[0.14em] text-white/75">GALLERY</h2>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {p.gallery.map((src) => (
              <a key={src} href={src} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden bg-space-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${p.title} 사진`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </a>
            ))}
          </div>
        </section>
      )}

      <nav className="mt-16 border-t border-white/20 md:mt-24" aria-label="다른 공연">
        <div className="container-x grid h-20 grid-cols-3 items-center font-display text-xs font-semibold tracking-[0.16em]">
          <div>{prev && <Link href={`/performances/${prev.slug}`} className="hover:opacity-70">← PREV</Link>}</div>
          <Link href="/performances" aria-label="공연 목록" className="justify-self-center hover:opacity-70">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
              {[3, 10, 17].flatMap((y) => [3, 10, 17].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" />))}
            </svg>
          </Link>
          <div className="justify-self-end">{next && <Link href={`/performances/${next.slug}`} className="hover:opacity-70">NEXT →</Link>}</div>
        </div>
      </nav>
    </div>
  );
}
