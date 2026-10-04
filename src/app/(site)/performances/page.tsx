import type { Metadata } from "next";
import Link from "next/link";
import { PosterCard } from "@/components/PosterCard";
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
    `whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition-colors ${
      active ? "bg-fg text-ink font-semibold" : "border border-line text-fg/75 hover:border-fg/40 hover:text-fg"
    }`;

  return (
    <div className="container-x pb-24 pt-32 md:pb-32 md:pt-44">
      <h1 className="font-display text-[40px] font-extrabold leading-none tracking-tight md:text-8xl">PERFORMANCE</h1>
      <p className="mt-4 text-muted md:text-lg">라이브유니버스가 만든 공연, 그리고 다음 공연</p>

      <div className="mt-12 space-y-3 border-y border-line py-5 md:mt-16">
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

      <p className="mb-8 mt-8 text-sm text-muted">
        총 <span className="text-fg">{list.length}</span>개 공연
      </p>
      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
          {list.map((p) => (
            <PosterCard key={p.slug} p={p} company={companies.find((c) => c.slug === p.company)} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line py-24 text-center text-muted">조건에 맞는 공연이 없습니다.</div>
      )}
    </div>
  );
}
