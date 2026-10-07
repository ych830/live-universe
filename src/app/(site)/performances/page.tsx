import type { Metadata } from "next";
import Link from "next/link";
import { PosterCard } from "@/components/Poster";
import { getCompanies, getPerformances } from "@/lib/content";
import { matchesQuery } from "@/lib/select";
import { STATUS_LABEL, getStatus, splitByTime, type Status } from "@/lib/status";

export const metadata: Metadata = { title: "공연" };

const STATUSES: Status[] = ["onsale", "opensoon", "upcoming", "past"];

export default async function PerformancesPage({ searchParams }: PageProps<"/performances">) {
  const sp = await searchParams;
  const status = STATUSES.find((s) => s === sp.status);
  const company = typeof sp.company === "string" ? sp.company : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const [performances, companies] = await Promise.all([getPerformances(), getCompanies()]);
  const { current, past } = splitByTime(performances);
  const list = [...current, ...past].filter(
    (p) => (!status || getStatus(p) === status) && (!company || p.company === company) && matchesQuery(p, q),
  );

  const href = (next: { status?: string; company?: string; q?: string }) => {
    const params = new URLSearchParams();
    const s = "status" in next ? next.status : status;
    const c = "company" in next ? next.company : company;
    const text = "q" in next ? next.q : q;
    if (text) params.set("q", text);
    if (s) params.set("status", s);
    if (c) params.set("company", c);
    const qs = params.toString();
    return qs ? `/performances?${qs}` : "/performances";
  };

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition-colors ${
      active ? "bg-text font-semibold text-paper" : "border border-rule hover:border-text"
    }`;

  return (
    <div className="pb-24 pt-12 md:pt-16">
      <div className="container-x">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <h1 className="font-display text-[40px] font-extrabold tracking-[-0.02em] md:text-[56px]">PROJECT</h1>
          <span className="hidden h-px w-12 bg-text/50 md:block" />
          <p className="text-[14px] text-sub">라이브유니버스가 만든 공연, 그리고 다음 공연</p>
        </div>

        <form action="/performances" className="mt-8 flex max-w-xl items-center gap-3 border-b-2 border-text">
          {status && <input type="hidden" name="status" value={status} />}
          {company && <input type="hidden" name="company" value={company} />}
          <input name="q" defaultValue={q} placeholder="공연명, 출연, 장소로 검색" className="flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-sub" />
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
      </div>
    </div>
  );
}
