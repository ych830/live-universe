import type { Metadata } from "next";
import { PerformanceBrowser, type ListFilter } from "@/components/PerformanceBrowser";
import { getCompanies, getPerformances } from "@/lib/content";

export const metadata: Metadata = { title: "공연" };

const pick = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function PerformancesPage({ searchParams }: PageProps<"/performances">) {
  const [performances, companies] = await Promise.all([getPerformances(), getCompanies()]);
  // 서버가 있으면 처음 HTML 부터 걸러서 보낸다.
  // GitHub Pages 정적 사본(PAGES_BASE_PATH)은 서버가 없으니 주소를 읽지 않고, 브라우저가 읽어서 거른다.
  const sp = process.env.PAGES_BASE_PATH ? {} : await searchParams;
  const initial: ListFilter = { status: pick(sp.status), company: pick(sp.company), q: pick(sp.q) };

  return (
    <div className="pb-24 pt-12 md:pt-16">
      <div className="container-x">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <h1 className="font-display text-[40px] font-extrabold tracking-[-0.02em] md:text-[56px]">PROJECT</h1>
          <span className="hidden h-px w-12 bg-text/50 md:block" />
          <p className="text-[14px] text-sub">라이브유니버스가 만든 공연, 그리고 다음 공연</p>
        </div>

        <PerformanceBrowser performances={performances} companies={companies} initial={initial} />
      </div>
    </div>
  );
}
