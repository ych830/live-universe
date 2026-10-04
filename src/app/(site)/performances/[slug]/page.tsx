import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/Countdown";
import { Poster, PosterCard } from "@/components/PosterCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TicketButtons } from "@/components/TicketButtons";
import { getCompanies, getPerformance, getPerformances } from "@/lib/content";
import { formatDateRange, formatDateTime, getStatus } from "@/lib/status";

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
  const related = all.filter((o) => o.slug !== p.slug && o.company && o.company === p.company).slice(0, 4);

  const info = [
    { k: "공연 일시", v: [formatDateRange(p.startDate, p.endDate), p.timeText].filter(Boolean).join("\n") },
    { k: "공연 장소", v: p.venue },
    { k: "출연", v: p.artist },
    { k: "관람 등급", v: p.ageRating },
    { k: "관람 시간", v: p.runningTime },
    { k: "티켓 가격", v: p.price },
    { k: "기획", v: company ? `${company.name} (${company.nameEn ?? ""})`.replace(" ()", "") : undefined },
  ].filter((r) => r.v);

  return (
    <div className="pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="relative">
        {p.poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.poster} alt="" aria-hidden className="pointer-events-none absolute inset-x-0 -top-32 h-[620px] w-full object-cover opacity-25 blur-3xl" />
        )}
        <div className="pointer-events-none absolute inset-x-0 -top-32 h-[640px] bg-gradient-to-b from-transparent to-ink" />

        <div className="container-x relative">
          <Link href="/performances" className="font-display text-[11px] tracking-[0.16em] text-fg/60 hover:text-fg">
            ← PERFORMANCE
          </Link>

          <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
            <div className="md:sticky md:top-28 md:self-start">
              <div className="mx-auto aspect-[5/7] w-[78%] overflow-hidden rounded-md shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-fg/10 md:w-full">
                <Poster p={p} />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={status} size="md" />
                {company && (
                  <Link href={`/performances?company=${company.slug}`} className="font-display text-[11px] tracking-[0.16em] text-violet hover:text-fg">
                    {company.nameEn ?? company.name}
                  </Link>
                )}
              </div>
              <h1 className="mt-6 text-[30px] font-bold leading-[1.2] tracking-tight md:text-5xl">{p.title}</h1>
              {p.subtitle && <p className="mt-3 text-base text-fg/75 md:text-lg">{p.subtitle}</p>}

              <div className="mt-10 rounded-xl border border-line bg-panel/70 p-5 backdrop-blur md:p-7">
                {status === "past" ? (
                  <p className="text-sm text-muted">종료된 공연입니다. 함께해 주셔서 감사합니다.</p>
                ) : (
                  <>
                    <p className="font-display text-[11px] tracking-[0.16em] text-muted">TICKET</p>
                    {p.ticketOpenAt && (
                      <p className="mt-3 text-lg font-semibold md:text-xl">
                        {status === "opensoon" ? "티켓 오픈 " : "티켓 오픈 완료 · "}
                        {formatDateTime(p.ticketOpenAt)}
                      </p>
                    )}
                    {status === "opensoon" && p.ticketOpenAt && (
                      <p className="mt-1 font-display text-2xl text-lime md:text-3xl">
                        <Countdown to={p.ticketOpenAt} />
                      </p>
                    )}
                    <div className="mt-5">
                      {p.ticketLinks.length > 0 ? (
                        <TicketButtons links={p.ticketLinks} />
                      ) : (
                        <p className="text-sm text-muted">예매처와 오픈 일정은 곧 공개됩니다.</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <dl className="mt-10 divide-y divide-line border-y border-line">
                {info.map((r) => (
                  <div key={r.k} className="grid grid-cols-[88px_1fr] gap-4 py-4 text-[15px] md:grid-cols-[120px_1fr]">
                    <dt className="text-muted">{r.k}</dt>
                    <dd className="whitespace-pre-line">{r.v}</dd>
                  </div>
                ))}
              </dl>

              {p.description && (
                <section className="mt-14">
                  <h2 className="font-display text-[11px] tracking-[0.16em] text-muted">INFORMATION</h2>
                  <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.9] text-fg/85">{p.description}</p>
                </section>
              )}

              {p.gallery.length > 0 && (
                <section className="mt-14">
                  <h2 className="font-display text-[11px] tracking-[0.16em] text-muted">GALLERY</h2>
                  <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4">
                    {p.gallery.map((src) => (
                      <a key={src} href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-md bg-panel">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`${p.title} 사진`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && company && (
        <section className="container-x mt-24 border-t border-line pt-16 md:mt-32">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">MORE FROM {company.nameEn ?? company.name}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((o) => (
              <PosterCard key={o.slug} p={o} company={company} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
