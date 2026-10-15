import type { Metadata } from "next";
import { Suspense } from "react";
import { PerformanceBrowser, PerformanceList } from "@/components/PerformanceBrowser";
import { getCompanies, getPerformances } from "@/lib/content";

export const metadata: Metadata = { title: "공연" };
export const revalidate = 60;

export default async function PerformancesPage() {
  const [performances, companies] = await Promise.all([getPerformances(), getCompanies()]);

  return (
    <div className="pb-24 pt-12 md:pt-16">
      <div className="container-x">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <h1 className="font-display text-[40px] font-extrabold tracking-[-0.02em] md:text-[56px]">PROJECT</h1>
          <span className="hidden h-px w-12 bg-text/50 md:block" />
          <p className="text-[14px] text-sub">라이브유니버스가 만든 공연, 그리고 다음 공연</p>
        </div>

        {/* 검색·필터는 브라우저가 주소(?q·status·company)를 읽어 거른다. 읽기 전에는 전체 목록을 보여준다 */}
        <Suspense fallback={<PerformanceList performances={performances} companies={companies} />}>
          <PerformanceBrowser performances={performances} companies={companies} />
        </Suspense>
      </div>
    </div>
  );
}
