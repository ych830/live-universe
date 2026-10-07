import type { Performance } from "./types";

export type Status = "onsale" | "opensoon" | "upcoming" | "past";

export const STATUS_LABEL: Record<Status, { en: string; ko: string }> = {
  onsale: { en: "NOW ON SALE", ko: "예매 중" },
  opensoon: { en: "OPEN SOON", ko: "오픈 예정" },
  upcoming: { en: "COMING SOON", ko: "공개 예정" },
  past: { en: "ARCHIVE", ko: "지난 공연" },
};

const TZ = "Asia/Seoul";

/** 한국 시간 기준 YYYY-MM-DD */
export function kstDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function getStatus(p: Performance, now: Date = new Date()): Status {
  const lastDay = p.endDate || p.startDate;
  if (lastDay < kstDate(now)) return "past";
  if (p.ticketOpenAt) return new Date(p.ticketOpenAt) > now ? "opensoon" : "onsale";
  return p.ticketLinks.length > 0 ? "onsale" : "upcoming";
}

/** 지금 이후 공연(가까운 순)과 지난 공연(최근 순)으로 나눈다 */
export function splitByTime(list: Performance[], now: Date = new Date()) {
  const current = list
    .filter((p) => getStatus(p, now) !== "past")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = list
    .filter((p) => getStatus(p, now) === "past")
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  return { current, past };
}

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

function parts(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  const wd = WEEKDAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return { y, m, d, wd };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** 2026.11.14 (토) – 11.15 (일) */
export function formatDateRange(start: string, end?: string): string {
  const s = parts(start);
  const head = `${s.y}.${pad(s.m)}.${pad(s.d)} (${s.wd})`;
  if (!end || end === start) return head;
  const e = parts(end);
  const tail = e.y === s.y ? `${pad(e.m)}.${pad(e.d)} (${e.wd})` : `${e.y}.${pad(e.m)}.${pad(e.d)} (${e.wd})`;
  return `${head} – ${tail}`;
}

/** 카드용 짧은 표기: 2026.11.14 – 11.15 */
export function formatDateCompact(start: string, end?: string): string {
  const s = start.replaceAll("-", ".");
  if (!end || end === start) return s;
  const e = end.slice(0, 4) === start.slice(0, 4) ? end.slice(5).replace("-", ".") : end.replaceAll("-", ".");
  return `${s} – ${e}`;
}

/** 2026.10.10 (토) 20:00 — 한국 시간 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const ymd = kstDate(d);
  const hm = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return `${formatDateRange(ymd)} ${hm}`;
}

export function yearOf(p: Performance): string {
  return p.startDate.slice(0, 4);
}

/** ISO → <input type="datetime-local"> 값 (한국 시간) */
export function toKstInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const hm = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  return `${kstDate(d)}T${hm}`;
}

/** <input type="datetime-local"> 값(한국 시간으로 입력) → ISO */
export function fromKstInput(v: string): string | undefined {
  return v ? `${v.slice(0, 16)}:00+09:00` : undefined;
}
