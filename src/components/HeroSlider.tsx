"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Status } from "@/lib/status";
import type { Performance } from "@/lib/types";
import { Countdown } from "./Countdown";
import { Poster } from "./Poster";
import { StatusBadge } from "./StatusBadge";
import { TicketButtons } from "./TicketButtons";

export interface HeroSlide {
  p: Performance;
  status: Status;
  companyName?: string;
  dateText: string;
  openText?: string;
}

const INTERVAL = 6000;

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden>
    <path d={dir === "left" ? "M15 5 8 12l7 7" : "m9 5 7 7-7 7"} />
  </svg>
);

/**
 * 첫 화면: 왼쪽 브랜드 문구는 고정, 가운데 포스터 + 오른쪽 공연 정보가 슬라이드로 넘어간다.
 * 여러 장이면 6초마다 자동으로 넘기고, 마우스를 올리거나 키보드로 들어오거나 동작 줄이기 설정이면 멈춘다.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  const go = useCallback((d: number) => setIndex((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    const first = setTimeout(sync, 0);
    mq.addEventListener("change", sync);
    return () => {
      clearTimeout(first);
      mq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const playing = n > 1 && !hovered && !focused && !reduced && visible;
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, playing, go]);

  // 예매 중·오픈 예정이 없을 때는 대표 공연 한 장만 나온다
  const ticketingSet = n > 0 && (slides[0].status === "onsale" || slides[0].status === "opensoon");

  return (
    <section
      aria-roledescription="carousel"
      aria-label={ticketingSet ? "예매 중·오픈 예정 공연" : "대표 공연"}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(e) => {
        if (n < 2 || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
        // 포커스가 있던 슬라이드가 inert 가 되면 포커스가 페이지 맨 위로 빠지므로 먼저 슬라이드 묶음으로 옮긴다
        if ((e.target as HTMLElement).closest('[aria-roledescription="slide"]')) stage.current?.focus({ preventScroll: true });
        go(e.key === "ArrowRight" ? 1 : -1);
      }}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (touch.current === null || n < 2) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        // 세로 스크롤 중 옆으로 조금 흔들린 것은 넘기지 않는다
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="container-x grid items-center gap-8 py-9 lg:grid-cols-[1fr_300px_1fr] lg:gap-14 lg:py-16">
        {/* 휴대폰에서는 첫 화면에 포스터가 보이도록 제목·슬로건만 남긴다 (소개 문구는 아래 ABOUT에 있음) */}
        <div>
          <p className="mb-3 hidden font-display text-[10.5px] font-medium leading-[2] tracking-[0.5em] text-sub lg:block">
            MUSIC CREATES
            <br />
            ANOTHER UNIVERSE
          </p>
          <h1 className="font-display text-[42px] font-extrabold leading-[0.95] tracking-[-0.02em] md:text-[60px]">
            LIVE
            <br />
            UNIVERSE
          </h1>
          <p className="mt-4 flex items-center gap-4 text-[15px] font-bold md:mt-5 md:text-[17px]">
            <span className="h-[2px] w-12 bg-brand-soft" />
            음악이 만드는, 또 하나의 우주
          </p>
          <p className="mt-5 hidden text-[14.5px] leading-[1.75] text-sub lg:block">
            라이브유니버스는
            <br />
            사람과 음악이 만나는 특별한 순간을 기획하는
            <br />
            공연 크리에이티브 그룹입니다.
          </p>
          <Link href="/#about" className="group mt-7 hidden items-center gap-3 font-display text-[11px] font-bold tracking-[0.2em] hover:text-brand-soft lg:inline-flex">
            OUR STORY <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* 슬라이드들을 같은 칸에 겹쳐 두고 보이는 것만 바꾼다 (높이는 가장 긴 슬라이드 기준이라 넘길 때 흔들리지 않음) */}
        <div ref={stage} tabIndex={-1} className="grid outline-offset-8 focus-visible:outline-1 focus-visible:outline-white/30 lg:col-span-2">
          {n > 1 && (
            <p className="sr-only" aria-live={playing ? "off" : "polite"}>
              {`${index + 1} / ${n}: ${slides[index]?.p.title ?? ""}`}
            </p>
          )}
          {slides.map((s, i) => {
            const active = i === index;
            const ticketing = s.status !== "past" && s.p.ticketLinks.length > 0;
            return (
              <div
                key={s.p.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${n}: ${s.p.title}`}
                aria-hidden={!active}
                inert={!active}
                className={`grid content-start items-center gap-8 transition-[opacity,visibility] lg:content-normal duration-700 [grid-area:1/1] lg:grid-cols-[300px_1fr] lg:gap-14 ${
                  active ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                <Link
                  href={`/performances/${s.p.slug}`}
                  className="mx-auto block w-[70%] max-w-[300px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-1 lg:w-full"
                >
                  {s.p.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.p.poster} alt={`${s.p.title} 포스터`} className="block h-auto w-full" />
                  ) : (
                    <div className="aspect-[3/4]">
                      <Poster p={s.p} />
                    </div>
                  )}
                </Link>

                <div>
                  <p className="flex items-center gap-4 font-display text-[11px] font-semibold tracking-[0.2em] text-brand-soft">
                    {s.status === "past" ? "FEATURED" : "NOW & NEXT"} <span className="h-px w-14 bg-current opacity-60" />
                  </p>
                  {s.status !== "past" && (
                    <div className="mt-5">
                      <StatusBadge status={s.status} />
                    </div>
                  )}
                  <h2 className="mt-4 text-[26px] font-bold leading-[1.35] md:text-[30px]">{s.p.title}</h2>
                  {s.p.subtitle && <p className="mt-2 text-[14px] text-sub">{s.p.subtitle}</p>}
                  <dl className="mt-7 grid grid-cols-[88px_1fr] gap-y-3 text-[13.5px]">
                    {s.p.venue && (
                      <>
                        <dt className="font-display text-[10.5px] tracking-[0.1em] text-sub">VENUE</dt>
                        <dd>{s.p.venue}</dd>
                      </>
                    )}
                    <dt className="font-display text-[10.5px] tracking-[0.1em] text-sub">DATE</dt>
                    <dd>{s.dateText}</dd>
                    {s.companyName && (
                      <>
                        <dt className="font-display text-[10.5px] tracking-[0.1em] text-sub">PRESENTS</dt>
                        <dd>{s.companyName}</dd>
                      </>
                    )}
                    {s.status === "opensoon" && s.p.ticketOpenAt && (
                      <>
                        <dt className="font-display text-[10.5px] tracking-[0.1em] text-sub">TICKET</dt>
                        <dd className="font-semibold">
                          {s.openText} 오픈
                          <Countdown to={s.p.ticketOpenAt} className="block font-display text-brand-soft" />
                        </dd>
                      </>
                    )}
                  </dl>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {ticketing && <TicketButtons links={s.p.ticketLinks.slice(0, 1)} />}
                    <Link
                      href={`/performances/${s.p.slug}`}
                      className={`group inline-flex items-center gap-4 px-5 py-3 font-display text-[12px] font-bold tracking-[0.16em] transition-colors ${
                        ticketing ? "border border-text/60 hover:border-text hover:bg-text hover:text-paper" : "bg-text text-paper hover:bg-brand hover:text-brand-ink"
                      }`}
                    >
                      VIEW MORE <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {n > 1 && (
            <div className="mt-8 flex items-center gap-5 lg:col-start-1 lg:mt-10 lg:row-start-2 lg:ml-[calc(300px+3.5rem)]">
              <button type="button" onClick={() => go(-1)} aria-label="이전 공연" className="flex h-10 w-10 items-center justify-center rounded-full border border-rule hover:border-text">
                <Arrow dir="left" />
              </button>
              <span className="font-display text-[12px] font-semibold tabular-nums tracking-[0.14em]" aria-hidden>
                {String(index + 1).padStart(2, "0")}
                <span className="text-sub"> / {String(n).padStart(2, "0")}</span>
              </span>
              <button type="button" onClick={() => go(1)} aria-label="다음 공연" className="flex h-10 w-10 items-center justify-center rounded-full border border-rule hover:border-text">
                <Arrow dir="right" />
              </button>
              <div className="flex flex-1 gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.p.slug}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${i + 1}번째 공연: ${s.p.title}`}
                    aria-current={i === index}
                    className="relative h-[3px] max-w-16 flex-1 overflow-hidden rounded-full bg-white/45"
                  >
                    <span
                      key={i === index ? `on-${index}` : "off"}
                      className={`absolute inset-0 origin-left bg-text ${i === index ? "" : "scale-x-0"}`}
                      style={i === index && playing ? { animation: `hero-progress ${INTERVAL}ms linear` } : undefined}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
