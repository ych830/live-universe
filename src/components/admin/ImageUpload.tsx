"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { uploadImage } from "@/lib/supabase-browser";

/** 이미지를 Supabase Storage 에 올리고 공개 URL 목록을 돌려준다 */
export function ImageUpload({
  sb,
  folder,
  value,
  onChange,
  multiple = false,
}: {
  sb: SupabaseClient;
  folder: string;
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadImage(sb, f, folder)));
      onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드에 실패했습니다");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className={multiple ? "grid grid-cols-3 gap-3 md:grid-cols-4" : ""}>
        {value.map((url) => (
          <div key={url} className={`group relative overflow-hidden rounded-lg border border-line bg-ink ${multiple ? "aspect-square" : "aspect-[5/7] w-40"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== url))}
              className="absolute right-1.5 top-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-xs opacity-0 transition-opacity group-hover:opacity-100"
            >
              삭제
            </button>
          </div>
        ))}
        {(multiple || value.length === 0) && (
          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-fg/25 text-center text-xs text-muted transition-colors hover:border-violet hover:text-fg ${
              multiple ? "aspect-square" : "aspect-[5/7] w-40"
            }`}
          >
            <span className="text-2xl leading-none">+</span>
            <span className="mt-2">{busy ? "올리는 중…" : multiple ? "사진 추가" : "포스터 올리기"}</span>
            <input type="file" accept="image/*" multiple={multiple} className="hidden" disabled={busy} onChange={(e) => {
                onFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-pink">{error}</p>}
    </div>
  );
}
