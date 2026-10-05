import type { Metadata } from "next";
import Link from "next/link";
import { PosterTile } from "@/components/Poster";
import { getCompanies, getPerformances } from "@/lib/content";
import { STATUS_LABEL, getStatus, splitByTime, type Status } from "@/lib/status";

export const metadata: Metadata = { title: "공연" };

const STATUSES: Status[] = ["onsale", "opensoon", "upcoming", "past"];

export default async function PerformancesPage({ searchParams }: PageProps<"/performances">) {
  const sp = await searchParams;
  const status = STATUSES.find((s) => s === sp.status);
  const company = typeof sp.company === "string" ? sp.company : undefined;

  const [performances, companies] = await Promise.all([getPerformances(), getCompanies()]);
  const { current, past } = splitByTime(performances);
  const list = [...current, ...past].filter(
    (p) => (!status || getStatus(p) === status) && (!company || p.company === company),
  );

  const href = (next: { status?: string; company?: string }) => {
    const q = new URLSearchParams();
    const s = "status" in next ? next.status : status;
    const c = "company" in next ? next.company : company;
    if (s) q.set("status", s);
    if (c) q.set("company", c);
    const qs = q.toString();
    return qs ? `/performances?${qs}` : "/performances";
  };

  const chip = (active: boolean) =>
    `whitespace-nowrap px-4 py-2 text-[13px] transition-colors ${
      active ? "bg-white font-semibold text-space" : "border border-white/40 hover:border-white"
    }`;

  return (
    <div className="pb-24 pt-10 md:pt-16">
      <div className="container-x text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">PERFORMANCE</h1>
        <p className="mt-2 text-white/80">라이브유니버스가 만든 공연, 그리고 다음 공연</p>
      </div>

      <div className="container-x mt-10 space-y-2.5 md:mt-12">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:justify-center md:px-0">
          <Link href={href({ status: undefined })} className={chip(!status)}>전체</Link>
          {STATUSES.map((s) => (
            <Link key={s} href={href({ status: s })} className={chip(status === s)}>
              {STATUS_LABEL[s].ko}
            </Link>
          ))}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:justify-center md:px-0">
          <Link href={href({ company: undefined })} className={chip(!company)}>모든 계열사</Link>
          {companies.map((c) => (
            <Link key={c.slug} href={href({ company: c.slug })} className={chip(company === c.slug)}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <p className="mb-6 mt-8 text-center text-sm text-white/75">총 {list.length}개 공연</p>
      {list.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {list.map((p) => (
            <PosterTile key={p.slug} p={p} company={companies.find((c) => c.slug === p.company)} showStatus={getStatus(p) !== "past"} />
          ))}
        </div>
      ) : (
        <div className="container-x">
          <div className="border border-dashed border-white/40 py-24 text-center text-white/75">조건에 맞는 공연이 없습니다.</div>
        </div>
      )}
    </div>
  );
}
