"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { filterPerformances } from "@/lib/select";
import { STATUS_LABEL, type Status } from "@/lib/status";
import type { Company, Performance } from "@/lib/types";
import { PosterCard } from "./Poster";

const STATUSES: Status[] = ["onsale", "opensoon", "upcoming", "past"];

export interface ListFilter {
  status?: string;
  company?: string;
  q?: string;
}

interface Props {
  performances: Performance[];
  companies: Company[];
  /** 서버가 주소에서 읽은 값. 서버가 없는 GitHub Pages 사본에서는 빈 값이고 브라우저가 주소를 읽어 채운다 */
  initial: ListFilter;
}

/**
 * 검색창 · 상태/계열사 칩 · 공연 카드.
 * 주소(?q·status·company)는 작은 SearchParamsSync 만 읽어서, 정적 사본에서도 목록을 갈아끼우지 않고 그 자리에서 거른다.
 */
export function PerformanceBrowser({ performances, companies, initial }: Props) {
  const [filter, setFilter] = useState(initial);
  const status = STATUSES.find((s) => s === filter.status);
  const company = filter.company || undefined;
  const q = (filter.q ?? "").trim();
  const list = filterPerformances(performances, { status, company, q });

  const href = (next: { status?: string; company?: string; q?: string }) => {
    const sp = new URLSearchParams();
    const s = "status" in next ? next.status : status;
    const c = "company" in next ? next.company : company;
    const text = "q" in next ? next.q : q;
    if (text) sp.set("q", text);
    if (s) sp.set("status", s);
    if (c) sp.set("company", c);
    const qs = sp.toString();
    return qs ? `/performances?${qs}` : "/performances";
  };

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition-colors ${
      active ? "bg-text font-semibold text-paper" : "border border-rule hover:border-text"
    }`;

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsSync onChange={setFilter} />
      </Suspense>
      <form action="/performances" className="mt-8 flex max-w-xl items-center gap-3 border-b-2 border-text">
        {status && <input type="hidden" name="status" value={status} />}
        {company && <input type="hidden" name="company" value={company} />}
        <input key={q} name="q" defaultValue={q} placeholder="공연명, 출연, 장소로 검색" className="flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-sub" />
        <button type="submit" className="font-display text-[12px] font-bold tracking-[0.12em] hover:opacity-60">
          SEARCH
        </button>
      </form>

      <div className="mt-6 space-y-2.5">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Link href={href({ status: undefined })} className={chip(!status)}>전체</Link>
          {STATUSES.map((s) => (
            <Link key={s} href={href({ status: s })} className={chip(status === s)}>
              {STATUS_LABEL[s].ko}
            </Link>
          ))}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Link href={href({ company: undefined })} className={chip(!company)}>모든 계열사</Link>
          {companies.map((c) => (
            <Link key={c.slug} href={href({ company: c.slug })} className={chip(company === c.slug)}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <p className="mb-8 mt-8 text-[13px] text-sub">
        {q && <span className="font-semibold text-text">‘{q}’ 검색 결과 · </span>}총 {list.length}개 공연
        {q && (
          <Link href={href({ q: undefined })} className="ml-3 underline">
            검색 지우기
          </Link>
        )}
      </p>

      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
          {list.map((p) => (
            <PosterCard key={p.slug} p={p} showStatus />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-rule py-24 text-center text-sub">조건에 맞는 공연이 없습니다.</div>
      )}
    </>
  );
}

/** 주소의 검색어·필터를 읽어 목록에 넘긴다. 이 컴포넌트만 브라우저에서 그려지므로 목록은 갈아끼워지지 않는다 */
function SearchParamsSync({ onChange }: { onChange: (f: ListFilter) => void }) {
  const query = useSearchParams().toString();
  useEffect(() => {
    const p = new URLSearchParams(query);
    onChange({ status: p.get("status") ?? undefined, company: p.get("company") ?? undefined, q: p.get("q") ?? undefined });
  }, [query, onChange]);
  return null;
}
