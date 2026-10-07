"use client";

import { useRef } from "react";

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-[1.5]" aria-hidden>
    <path d={dir === "left" ? "M15 4 7 12l8 8" : "m9 4 8 8-8 8"} />
  </svg>
);

/** 옆으로 넘기는 포스터 줄. 화살표는 넓은 화면에서만 (작은 화면은 손가락으로 넘김) */
export function Carousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:gap-6 md:px-0">
        {children}
      </div>
      <button type="button" onClick={() => go(-1)} aria-label="이전 공연" className="absolute -left-12 top-[38%] hidden -translate-y-1/2 p-2 hover:opacity-60 xl:block">
        <Arrow dir="left" />
      </button>
      <button type="button" onClick={() => go(1)} aria-label="다음 공연" className="absolute -right-12 top-[38%] hidden -translate-y-1/2 p-2 hover:opacity-60 xl:block">
        <Arrow dir="right" />
      </button>
    </div>
  );
}
