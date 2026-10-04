"use client";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { StatusBadge } from "@/components/StatusBadge";
import { rowToCompany, rowToPerformance } from "@/lib/content/supabase";
import { formatDateRange, getStatus } from "@/lib/status";
import { browserClient } from "@/lib/supabase-browser";
import { CompanyForm, EMPTY_COMPANY, type CompanyRow } from "./CompanyForm";
import { EMPTY_PERFORMANCE, PerformanceForm, type PerformanceRow } from "./PerformanceForm";
import { btn, Field, inputCls } from "./ui";

type Tab = "performances" | "companies";

export function AdminApp({ source }: { source: "files" | "supabase" }) {
  const sb = browserClient();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  if (!sb) return <SetupNotice />;
  if (session === undefined) return <Shell>불러오는 중…</Shell>;
  if (!session) return <Login sb={sb} />;
  return <Dashboard sb={sb} email={session.user.email ?? ""} source={source} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh items-center justify-center px-4 text-sm text-muted">{children}</div>;
}

function SetupNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <LogoMark className="h-10 w-10" />
      <h1 className="mt-6 text-2xl font-bold">관리자 페이지 준비가 필요해요</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Supabase 키가 아직 연결되지 않았습니다. README 의 &lsquo;Supabase 연결&rsquo;을 따라 <code className="text-fg">.env.local</code> (배포 시에는 호스팅 환경변수)에 아래 값을
        넣어 주세요.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs leading-relaxed">
        {`CONTENT_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...`}
      </pre>
      <p className="mt-6 text-sm text-muted">
        파일 방식(Decap CMS)으로 관리하려면{" "}
        <a href="/cms/" className="text-fg underline">
          /cms
        </a>{" "}
        로 가세요.
      </p>
    </div>
  );
}

function Login({ sb }: { sb: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError("이메일 또는 비밀번호가 맞지 않습니다.");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-panel/60 p-8">
        <div className="flex items-center gap-2">
          <LogoMark className="h-7 w-7" />
          <span className="font-display text-sm tracking-[0.08em]">LIVE UNIVERSE</span>
        </div>
        <h1 className="pb-2 text-xl font-bold">관리자 로그인</h1>
        <Field label="이메일">
          <input type="email" required autoComplete="username" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="비밀번호">
          <input type="password" required autoComplete="current-password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <p className="text-sm text-pink">{error}</p>}
        <button type="submit" disabled={busy} className={`${btn.primary} w-full`}>
          {busy ? "로그인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ sb, email, source }: { sb: SupabaseClient; email: string; source: "files" | "supabase" }) {
  const [tab, setTab] = useState<Tab>("performances");
  const [performances, setPerformances] = useState<PerformanceRow[]>([]);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [editingP, setEditingP] = useState<PerformanceRow | null>(null);
  const [editingC, setEditingC] = useState<CompanyRow | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([
      sb.from("performances").select("*").order("start_date", { ascending: false }),
      sb.from("companies").select("*").order("sort_order"),
    ]);
    const err = p.error ?? c.error;
    setError(err ? `불러오기 실패: ${err.message}` : "");
    setPerformances((p.data ?? []).map((r) => ({ ...rowToPerformance(r), id: r.id as string })));
    setCompanies((c.data ?? []).map((r) => ({ ...rowToCompany(r), id: r.id as string })));
  }, [sb]);

  useEffect(() => {
    // 마운트 시 한 번 불러온다 (setState 는 await 이후에 일어난다)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const done = (saved: boolean) => {
    setEditingP(null);
    setEditingC(null);
    if (saved) {
      setNotice("저장했어요. 홈페이지에는 1분 안에 반영됩니다.");
      load();
    }
    window.scrollTo(0, 0);
  };

  async function remove(table: "performances" | "companies", id: string | undefined, name: string) {
    if (!id || !confirm(`'${name}'을(를) 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const { error } = await sb.from(table).delete().eq("id", id);
    if (error) setError(error.message);
    else {
      setNotice("삭제했어요.");
      load();
    }
  }

  const editing = editingP || editingC;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <LogoMark className="h-6 w-6" />
            <span className="font-display text-xs tracking-[0.1em]">ADMIN</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted md:inline">{email}</span>
            <Link href="/" target="_blank" className="text-fg/70 hover:text-fg">
              홈페이지 ↗
            </Link>
            <button type="button" onClick={() => sb.auth.signOut()} className="text-fg/70 hover:text-fg">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {source !== "supabase" && (
          <p className="mb-6 rounded-lg border border-lime/40 bg-lime/10 px-4 py-3 text-sm text-lime">
            지금 홈페이지는 파일(Decap CMS) 데이터를 보여주고 있어요. 여기서 등록한 공연을 홈페이지에 보이게 하려면 환경변수
            CONTENT_SOURCE=supabase 로 바꿔 주세요.
          </p>
        )}
        {notice && !editing && (
          <p className="mb-6 rounded-lg border border-violet/40 bg-violet/10 px-4 py-3 text-sm">{notice}</p>
        )}
        {error && <p className="mb-6 rounded-lg border border-pink/40 bg-pink/10 px-4 py-3 text-sm text-pink">{error}</p>}

        {editingP ? (
          <PerformanceForm sb={sb} initial={editingP} companies={companies} onDone={done} />
        ) : editingC ? (
          <CompanyForm sb={sb} initial={editingC} onDone={done} />
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex gap-1 rounded-lg border border-line p-1">
                {(
                  [
                    ["performances", `공연 ${performances.length}`],
                    ["companies", `계열사 ${companies.length}`],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setTab(k)}
                    className={`rounded-md px-4 py-2 text-sm ${tab === k ? "bg-fg font-semibold text-ink" : "text-fg/70 hover:text-fg"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={btn.primary}
                onClick={() => {
                  setNotice("");
                  if (tab === "performances") setEditingP({ ...EMPTY_PERFORMANCE });
                  else setEditingC({ ...EMPTY_COMPANY, order: companies.length + 1 });
                }}
              >
                + {tab === "performances" ? "공연 등록" : "계열사 등록"}
              </button>
            </div>

            {tab === "performances" ? (
              <ul className="divide-y divide-line rounded-xl border border-line">
                {performances.length === 0 && <li className="p-10 text-center text-sm text-muted">등록된 공연이 없어요. 오른쪽 위 버튼으로 첫 공연을 등록해 보세요.</li>}
                {performances.map((p) => (
                  <li key={p.id} className="flex items-center gap-4 p-3 md:p-4">
                    <div className="aspect-[5/7] w-12 shrink-0 overflow-hidden rounded bg-panel md:w-14">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.poster && <img src={p.poster} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={getStatus(p)} />
                        {p.featured && <span className="text-xs text-lime">메인 노출</span>}
                      </div>
                      <p className="mt-1.5 truncate font-semibold">{p.title}</p>
                      <p className="text-xs text-muted">
                        {formatDateRange(p.startDate, p.endDate)} · {companies.find((c) => c.slug === p.company)?.name ?? "계열사 없음"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" className={btn.ghost} onClick={() => setEditingP(p)}>
                        수정
                      </button>
                      <button type="button" className={btn.danger} onClick={() => remove("performances", p.id, p.title)}>
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="divide-y divide-line rounded-xl border border-line">
                {companies.length === 0 && <li className="p-10 text-center text-sm text-muted">등록된 계열사가 없어요.</li>}
                {companies.map((c) => (
                  <li key={c.id} className="flex items-center gap-4 p-4">
                    <span className="w-8 text-center font-display text-xs text-muted">{c.order}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {c.name} <span className="font-normal text-muted">{c.nameEn}</span>
                      </p>
                      <p className="text-xs text-muted">{c.tagline}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" className={btn.ghost} onClick={() => setEditingC(c)}>
                        수정
                      </button>
                      <button type="button" className={btn.danger} onClick={() => remove("companies", c.id, c.name)}>
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
