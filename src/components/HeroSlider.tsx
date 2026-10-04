"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Status } from "@/lib/status";
import type { Performance } from "@/lib/types";
import { Countdown } from "./Countdown";
import { StatusBadge } from "./StatusBadge";

export interface HeroSlide {
  p: Performance;
  status: Status;
  companyName?: string;
  dateText: string;
  openText?: string;
}

const INTERVAL = 6500;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearTimeout(id);
  }, [index, paused, slides.length]);

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map(({ p }, i) => (
        <div key={p.slug} className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== index}>
          {p.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.poster} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-3xl" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
        </div>
      ))}

      <div className="container-x relative flex min-h-[100svh] flex-col justify-center pb-28 pt-28 md:pb-24 md:pt-32">
        {slides.map((s, i) => (
          <div
            key={s.p.slug}
            className={`grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-16 ${i === index ? "" : "hidden"}`}
          >
            <div className="order-2 md:order-1">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={s.status} size="md" />
                {s.companyName && <span className="font-display text-[11px] tracking-[0.16em] text-fg/70">{s.companyName}</span>}
              </div>
              <h1 className="mt-6 font-display text-[34px] font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">{s.p.title}</h1>
              {s.p.subtitle && <p className="mt-4 text-base text-fg/80 md:text-xl">{s.p.subtitle}</p>}
              <dl className="mt-8 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm md:text-[15px]">
                <dt className="font-display text-[11px] tracking-[0.16em] text-muted">DATE</dt>
                <dd>{s.dateText}</dd>
                {s.p.venue && (
                  <>
                    <dt className="font-display text-[11px] tracking-[0.16em] text-muted">VENUE</dt>
                    <dd>{s.p.venue}</dd>
                  </>
                )}
                {s.status === "opensoon" && s.openText && (
                  <>
                    <dt className="font-display text-[11px] tracking-[0.16em] text-lime">OPEN</dt>
                    <dd>
                      {s.openText}
                      <Countdown to={s.p.ticketOpenAt!} className="ml-2 text-lime" />
                    </dd>
                  </>
                )}
              </dl>
              <div className="mt-10 flex flex-wrap gap-3">
                {s.p.ticketLinks[0] && (
                  <a
                    href={s.p.ticketLinks[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-fg px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-pink hover:text-white"
                  >
                    {s.status === "opensoon" ? "예매처 바로가기 ↗" : "지금 예매하기 ↗"}
                  </a>
                )}
                <Link href={`/performances/${s.p.slug}`} className="rounded-full border border-fg/30 px-6 py-3.5 text-sm font-semibold transition-colors hover:border-fg">
                  공연 상세 보기
                </Link>
              </div>
            </div>
            <Link href={`/performances/${s.p.slug}`} className="order-1 mx-auto w-[58%] max-w-[380px] md:order-2 md:w-full">
              <div className="aspect-[5/7] overflow-hidden rounded-md shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] ring-1 ring-fg/10 transition-transform duration-700 hover:-rotate-1 hover:scale-[1.02]">
                {s.p.poster && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.p.poster} alt={`${s.p.title} 포스터`} className="h-full w-full object-cover" />
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="container-x absolute inset-x-0 bottom-8 flex items-center gap-4 md:bottom-12">
          <span className="font-display text-xs tabular-nums tracking-widest">
            {String(index + 1).padStart(2, "0")}
            <span className="text-muted"> / {String(slides.length).padStart(2, "0")}</span>
          </span>
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.p.slug}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번째 공연 보기`}
                className="relative h-[3px] w-10 overflow-hidden rounded-full bg-fg/20 md:w-16"
              >
                <span
                  className={`absolute inset-y-0 left-0 bg-fg ${i === index ? "w-full" : i < index ? "w-full opacity-40" : "w-0"}`}
                  style={i === index && !paused ? { animation: `grow ${INTERVAL}ms linear` } : undefined}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes grow{from{width:0}to{width:100%}}`}</style>
    </section>
  );
}
