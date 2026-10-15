"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { filterPerformances } from "@/lib/select";
import { STATUS_LABEL, type Status } from "@/lib/status";
import type { Company, Performance } from "@/lib/types";
import { PosterCard } from "./Poster";

const STATUSES: Status[] = ["onsale", "opensoon", "upcoming", "past"];

interface Props {
  performances: Performance[];
  companies: Company[];
}

/** 주소의 ?q·status·company 를 브라우저에서 읽어 거른다 (서버 없이 올린 정적 사본에서도 동작하도록) */
export function PerformanceBrowser(props: Props) {
  const params = useSearchParams();
  return <PerformanceList {...props} params={params} />;
}

/** 검색창 · 상태/계열사 칩 · 공연 카드. params 가 없으면 거르지 않은 전체 목록 */
export function PerformanceList({ performances, companies, params }: Props & { params?: { get(name: string): string | null } }) {
  const status = STATUSES.find((s) => s === params?.get("status"));
  const company = params?.get("company") || undefined;
  const q = (params?.get("q") ?? "").trim();
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
