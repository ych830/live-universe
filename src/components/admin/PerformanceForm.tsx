"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { performanceToRow } from "@/lib/content/supabase";
import { fromKstInput, toKstInput } from "@/lib/status";
import type { Company, Performance, TicketLink } from "@/lib/types";
import { VENDORS } from "@/lib/vendors";
import { ImageUpload } from "./ImageUpload";
import { Card, Field, btn, inputCls } from "./ui";

export type PerformanceRow = Performance & { id?: string };

export const EMPTY_PERFORMANCE: PerformanceRow = {
  slug: "",
  title: "",
  gallery: [],
  startDate: "",
  ticketLinks: [],
  featured: false,
};

const SLUG_RE = /^[a-z0-9-]+$/;

export function PerformanceForm({
  sb,
  initial,
  companies,
  onDone,
}: {
  sb: SupabaseClient;
  initial: PerformanceRow;
  companies: Company[];
  onDone: (saved: boolean) => void;
}) {
  const [p, setP] = useState<PerformanceRow>(initial);
  const [openAt, setOpenAt] = useState(toKstInput(initial.ticketOpenAt));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof PerformanceRow>(k: K, v: PerformanceRow[K]) => setP((prev) => ({ ...prev, [k]: v }));
  const text = (k: keyof PerformanceRow) => ({
    value: (p[k] as string | undefined) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(k, (e.target.value || undefined) as never),
  });
  const setLink = (i: number, patch: Partial<TicketLink>) =>
    set("ticketLinks", p.ticketLinks.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const slug = p.slug || `${p.startDate}-${Math.random().toString(36).slice(2, 6)}`;
    if (!SLUG_RE.test(slug)) return setError("주소는 영문 소문자, 숫자, - 만 쓸 수 있어요.");
    if (p.endDate && p.endDate < p.startDate) return setError("종료일이 시작일보다 빠릅니다.");
    const links = p.ticketLinks.filter((l) => l.url.trim());
    if (links.some((l) => !/^https?:\/\//.test(l.url.trim()))) return setError("예매처 링크는 https:// 로 시작해야 해요.");

    setSaving(true);
    const row = performanceToRow({ ...p, slug, ticketOpenAt: fromKstInput(openAt), ticketLinks: links });
    const { error } = p.id
      ? await sb.from("performances").update({ ...row, updated_at: new Date().toISOString() }).eq("id", p.id)
      : await sb.from("performances").insert(row);
    setSaving(false);
    if (error) return setError(error.code === "23505" ? "같은 주소(slug)를 쓰는 공연이 이미 있어요." : error.message);
    onDone(true);
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{p.id ? "공연 수정" : "새 공연 등록"}</h2>
        <button type="button" onClick={() => onDone(false)} className={btn.ghost}>
          목록으로
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
        <Card title="POSTER">
          <ImageUpload sb={sb} folder="posters" value={p.poster ? [p.poster] : []} onChange={(urls) => set("poster", urls[0])} />
        </Card>

        <Card title="BASIC">
          <Field label="공연 제목" required>
            <input className={inputCls} required {...text("title")} placeholder="BLUE HOUR 2026 TOUR - 서울" />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="부제">
              <input className={inputCls} {...text("subtitle")} placeholder="블루아워 단독 콘서트" />
            </Field>
            <Field label="출연">
              <input className={inputCls} {...text("artist")} placeholder="블루아워" />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="기획 계열사">
              <select className={inputCls} {...text("company")}>
                <option value="">선택 안 함</option>
                {companies.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="주소 (영문)" hint="비워 두면 자동으로 만들어요. 예: blue-hour-2026-seoul">
              <input className={inputCls} {...text("slug")} placeholder="blue-hour-2026-seoul" />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-pink" />
            메인 화면 맨 위 슬라이드에 보여주기
          </label>
        </Card>
      </div>

      <Card title="SCHEDULE & PLACE">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="시작일" required>
            <input type="date" className={inputCls} required {...text("startDate")} />
          </Field>
          <Field label="종료일" hint="하루 공연이면 비워 두세요">
            <input type="date" className={inputCls} {...text("endDate")} />
          </Field>
          <Field label="공연 시간 안내">
            <input className={inputCls} {...text("timeText")} placeholder="토 18:00 / 일 17:00" />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="장소">
            <input className={inputCls} {...text("venue")} placeholder="올림픽공원 올림픽홀" />
          </Field>
          <Field label="티켓 가격">
            <input className={inputCls} {...text("price")} placeholder="R석 154,000원 / S석 132,000원" />
          </Field>
          <Field label="관람 등급">
            <input className={inputCls} {...text("ageRating")} placeholder="만 9세 이상" />
          </Field>
          <Field label="관람 시간">
            <input className={inputCls} {...text("runningTime")} placeholder="약 150분" />
          </Field>
        </div>
      </Card>

      <Card title="TICKET">
        <Field label="티켓 오픈 일시 (한국 시간)" hint="이 시각 전에는 'OPEN SOON'과 카운트다운이, 이후에는 'NOW ON SALE'이 표시돼요">
          <input type="datetime-local" className={`${inputCls} md:w-72`} value={openAt} onChange={(e) => setOpenAt(e.target.value)} />
        </Field>
        <div className="space-y-2">
          <span className="block text-[13px] font-medium text-fg/80">예매처 링크</span>
          {p.ticketLinks.map((l, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[160px_1fr_auto]">
              <select className={inputCls} value={l.vendor} onChange={(e) => setLink(i, { vendor: e.target.value })}>
                {VENDORS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                {l.vendor === "etc" && (
                  <input className={`${inputCls} w-32`} value={l.label ?? ""} onChange={(e) => setLink(i, { label: e.target.value || undefined })} placeholder="예매처 이름" />
                )}
                <input className={inputCls} value={l.url} onChange={(e) => setLink(i, { url: e.target.value })} placeholder="https://..." />
              </div>
              <button type="button" className={btn.danger} onClick={() => set("ticketLinks", p.ticketLinks.filter((_, j) => j !== i))}>
                삭제
              </button>
            </div>
          ))}
          <button type="button" className={btn.ghost} onClick={() => set("ticketLinks", [...p.ticketLinks, { vendor: "nol", url: "" }])}>
            + 예매처 추가
          </button>
        </div>
      </Card>

      <Card title="DETAIL">
        <Field label="상세 설명" hint="줄바꿈은 그대로 보여요">
          <textarea className={`${inputCls} min-h-40`} {...text("description")} />
        </Field>
        <span className="block text-[13px] font-medium text-fg/80">사진 (공연 현장, 상세 이미지 등)</span>
        <ImageUpload sb={sb} folder="gallery" value={p.gallery} onChange={(urls) => set("gallery", urls)} multiple />
      </Card>

      {error && <p className="rounded-lg border border-pink/40 bg-pink/10 px-4 py-3 text-sm text-pink">{error}</p>}
      <div className="sticky bottom-0 -mx-4 flex justify-end gap-2 border-t border-line bg-ink/90 px-4 py-4 backdrop-blur">
        <button type="button" onClick={() => onDone(false)} className={btn.ghost}>
          취소
        </button>
        <button type="submit" disabled={saving} className={btn.primary}>
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>
    </form>
  );
}
