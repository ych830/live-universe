"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { companyToRow } from "@/lib/content/supabase";
import type { Company } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";
import { Card, Field, btn, inputCls } from "./ui";

export type CompanyRow = Company & { id?: string };

export const EMPTY_COMPANY: CompanyRow = { slug: "", name: "", order: 0 };

export function CompanyForm({ sb, initial, onDone }: { sb: SupabaseClient; initial: CompanyRow; onDone: (saved: boolean) => void }) {
  const [c, setC] = useState<CompanyRow>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof CompanyRow>(k: K, v: CompanyRow[K]) => setC((prev) => ({ ...prev, [k]: v }));
  const text = (k: keyof CompanyRow) => ({
    value: (c[k] as string | undefined) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, (e.target.value || undefined) as never),
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[a-z0-9-]+$/.test(c.slug)) return setError("주소는 영문 소문자, 숫자, - 만 쓸 수 있어요.");
    setSaving(true);
    const row = companyToRow(c);
    const { error } = c.id ? await sb.from("companies").update(row).eq("id", c.id) : await sb.from("companies").insert(row);
    setSaving(false);
    if (error) return setError(error.code === "23505" ? "같은 주소(slug)를 쓰는 계열사가 이미 있어요." : error.message);
    onDone(true);
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{c.id ? "계열사 수정" : "새 계열사 등록"}</h2>
        <button type="button" onClick={() => onDone(false)} className={btn.ghost}>
          목록으로
        </button>
      </div>
      <Card title="COMPANY">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="이름" required>
            <input className={inputCls} required {...text("name")} placeholder="노바 스테이지" />
          </Field>
          <Field label="영문 이름">
            <input className={inputCls} {...text("nameEn")} placeholder="NOVA STAGE" />
          </Field>
          <Field label="주소 (영문)" required hint="공연 필터 주소에 쓰여요. 예: nova-stage">
            <input className={inputCls} required {...text("slug")} placeholder="nova-stage" />
          </Field>
          <Field label="한 줄 소개">
            <input className={inputCls} {...text("tagline")} placeholder="아티스트 단독 콘서트 · 투어" />
          </Field>
          <Field label="홈페이지">
            <input className={inputCls} {...text("website")} placeholder="https://" />
          </Field>
          <Field label="인스타그램">
            <input className={inputCls} {...text("instagram")} placeholder="https://www.instagram.com/..." />
          </Field>
          <Field label="보여줄 순서" hint="작은 숫자가 먼저 나와요">
            <input type="number" className={inputCls} value={c.order} onChange={(e) => set("order", Number(e.target.value) || 0)} />
          </Field>
        </div>
        <Field label="소개">
          <textarea className={`${inputCls} min-h-32`} {...text("description")} />
        </Field>
        <span className="block text-[13px] font-medium text-fg/80">로고</span>
        <ImageUpload sb={sb} folder="logos" value={c.logo ? [c.logo] : []} onChange={(urls) => set("logo", urls[0])} />
      </Card>
      {error && <p className="rounded-lg border border-pink/40 bg-pink/10 px-4 py-3 text-sm text-pink">{error}</p>}
      <div className="flex justify-end gap-2">
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
