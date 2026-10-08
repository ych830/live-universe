import type { Metadata } from "next";
import Link from "next/link";
import { Orbit } from "@/components/Orbit";
import { PosterCard } from "@/components/Poster";
import { getCompanies, getPerformances } from "@/lib/content";
import { splitByTime } from "@/lib/status";

export const metadata: Metadata = { title: "계열사" };
export const revalidate = 60;

export default async function CompaniesPage() {
  const [companies, performances] = await Promise.all([getCompanies(), getPerformances()]);
  const { current, past } = splitByTime(performances);
  const ordered = [...current, ...past];

  return (
    <div className="overflow-x-clip pb-24 pt-12 md:pt-16">
      <div className="container-x grid items-center gap-12 md:grid-cols-2">
        <div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <h1 className="font-display text-[40px] font-extrabold tracking-[-0.02em] md:text-[56px]">COMPANIES</h1>
            <span className="hidden h-px w-12 bg-text/50 md:block" />
          </div>
          <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-sub">
            라이브유니버스 안에는 각자의 색을 가진 기획사들이 있습니다. 페스티벌부터 클럽 공연까지, 저마다의 궤도에서 무대를 만듭니다.
          </p>
        </div>
        <Orbit companies={companies} />
      </div>

      <div className="container-x mt-16 md:mt-24">
        {companies.map((c, i) => {
          const list = ordered.filter((p) => p.company === c.slug);
          return (
            <section key={c.slug} id={c.slug} className="scroll-mt-4 border-t border-rule py-12 md:py-16">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    {c.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logo} alt={`${c.name} 로고`} className="h-14 w-14 rounded-full border border-rule bg-white object-contain p-2" />
                    ) : (
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand font-display text-lg font-bold text-brand-ink">
                        {(c.nameEn ?? c.name).slice(0, 1)}
                      </span>
                    )}
                    <span className="font-display text-sm font-semibold text-sub">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{c.nameEn ?? c.name}</h2>
                  <p className="mt-2">
                    {c.name}
                    {c.tagline && <span className="text-sub"> · {c.tagline}</span>}
                  </p>
                  {c.description && <p className="mt-6 whitespace-pre-line text-[15px] leading-[1.85] text-sub">{c.description}</p>}
                  <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-8 text-sm">
                    <Link href={`/performances?company=${c.slug}`} className="border-b border-text pb-0.5 font-semibold hover:opacity-60">
                      공연 {list.length}개 보기 →
                    </Link>
                    {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="text-sub hover:text-text">WEBSITE ↗</a>}
                    {c.instagram && <a href={c.instagram} target="_blank" rel="noreferrer" className="text-sub hover:text-text">INSTAGRAM ↗</a>}
                  </div>
                </div>
                {list.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 md:gap-5">
                    {list.slice(0, 3).map((p) => (
                      <PosterCard key={p.slug} p={p} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
