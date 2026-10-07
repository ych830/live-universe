import Link from "next/link";
import type { Company } from "@/lib/types";

/** 가운데 LIVE UNIVERSE, 계열사들이 궤도를 도는 그림 */
export function Orbit({ companies }: { companies: Company[] }) {
  const n = Math.max(companies.length, 1);
  return (
    <div className="@container relative mx-auto aspect-square w-full max-w-[480px]">
      <div className="absolute inset-[6%] rounded-full border border-text/20" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-text/20" />
      <div className="absolute inset-[36%] flex items-center justify-center rounded-full bg-text text-center text-paper">
        <span className="font-display text-[11px] font-extrabold leading-tight tracking-[0.06em] md:text-sm">
          LIVE
          <br />
          UNIVERSE
        </span>
      </div>
      <div className="absolute inset-[6%] animate-spin-slow">
        {companies.map((c, i) => {
          const angle = (360 / n) * i - 90;
          return (
            <div key={c.slug} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transform: `rotate(${angle}deg) translateX(var(--r))`, ["--r" as string]: "40cqw" }}>
              <div style={{ transform: `rotate(${-angle}deg)` }}>
                <div className="animate-spin-rev">
                  <Link
                    href={`/performances?company=${c.slug}`}
                    className="group -ml-9 -mt-9 flex h-[72px] w-[72px] flex-col items-center justify-center md:-ml-12 md:-mt-12 md:h-24 md:w-24"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-brand-ink transition-transform group-hover:scale-110 md:h-14 md:w-14 md:text-base">
                      {(c.nameEn ?? c.name).slice(0, 1)}
                    </span>
                    <span className="mt-2 whitespace-nowrap font-display text-[9px] font-semibold tracking-[0.12em] md:text-[10px]">{c.nameEn ?? c.name}</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
