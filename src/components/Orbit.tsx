import Link from "next/link";
import type { Company } from "@/lib/types";

const PLANET = ["from-violet to-pink", "from-sky-400 to-violet", "from-lime to-emerald-400", "from-amber-300 to-pink", "from-pink to-orange-400"];

/** 가운데 LIVE UNIVERSE, 계열사들이 궤도를 도는 그림 */
export function Orbit({ companies }: { companies: Company[] }) {
  const n = Math.max(companies.length, 1);
  return (
    <div className="@container relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute inset-[6%] rounded-full border border-line" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-fg/15" />
      <div className="absolute inset-[38%] rounded-full bg-gradient-to-br from-violet/40 to-pink/30 blur-2xl" />
      <div className="absolute inset-[36%] flex items-center justify-center rounded-full border border-fg/20 bg-ink/60 text-center backdrop-blur">
        <span className="font-display text-[11px] leading-tight tracking-[0.16em] md:text-sm">
          LIVE
          <br />
          UNIVERSE
        </span>
      </div>
      <div className="absolute inset-[6%] animate-spin-slow">
        {companies.map((c, i) => {
          const angle = (360 / n) * i - 90;
          return (
            <div key={c.slug} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transform: `rotate(${angle}deg) translateX(var(--r))`, ["--r" as string]: "44cqw" }}>
              <div style={{ transform: `rotate(${-angle}deg)` }}>
                <div className="animate-spin-rev">
                  <Link
                    href={`/performances?company=${c.slug}`}
                    className="group -ml-9 -mt-9 flex h-[72px] w-[72px] flex-col items-center justify-center md:-ml-12 md:-mt-12 md:h-24 md:w-24"
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${PLANET[i % PLANET.length]} font-display text-sm font-semibold text-ink shadow-[0_0_40px_-6px] shadow-violet/60 transition-transform group-hover:scale-110 md:h-16 md:w-16 md:text-base`}>
                      {(c.nameEn ?? c.name).slice(0, 1)}
                    </span>
                    <span className="mt-2 whitespace-nowrap font-display text-[9px] tracking-[0.14em] text-fg/80 md:text-[10px]">{c.nameEn ?? c.name}</span>
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
