import { describe, expect, it } from "vitest";
import { formatDateRange, formatDateTime, getStatus, splitByTime } from "./status";
import type { Performance } from "./types";

const base: Performance = {
  slug: "x",
  title: "x",
  gallery: [],
  detailImages: [],
  startDate: "2026-11-14",
  endDate: "2026-11-15",
  ticketLinks: [],
  featured: false,
};
// 2026-10-04 12:00 KST
const now = new Date("2026-10-04T03:00:00Z");

describe("getStatus", () => {
  it("끝난 공연은 past", () => {
    expect(getStatus({ ...base, startDate: "2026-10-01", endDate: "2026-10-03" }, now)).toBe("past");
  });
  it("공연 당일은 아직 past 가 아님 (KST 기준)", () => {
    // UTC로는 10-03 이지만 KST로는 10-04 오전
    const earlyKst = new Date("2026-10-03T16:00:00Z");
    expect(getStatus({ ...base, startDate: "2026-10-04", endDate: undefined }, earlyKst)).not.toBe("past");
    expect(getStatus({ ...base, startDate: "2026-10-03", endDate: undefined }, earlyKst)).toBe("past");
  });
  it("오픈 시각 전이면 opensoon, 후면 onsale", () => {
    expect(getStatus({ ...base, ticketOpenAt: "2026-10-10T20:00:00+09:00" }, now)).toBe("opensoon");
    expect(getStatus({ ...base, ticketOpenAt: "2026-09-22T20:00:00+09:00" }, now)).toBe("onsale");
  });
  it("오픈 시각 없이 링크만 있으면 onsale, 둘 다 없으면 upcoming", () => {
    expect(getStatus({ ...base, ticketLinks: [{ vendor: "nol", url: "https://example.com" }] }, now)).toBe("onsale");
    expect(getStatus(base, now)).toBe("upcoming");
  });
});

describe("splitByTime", () => {
  it("다가오는 공연은 가까운 순, 지난 공연은 최근 순", () => {
    const list = [
      { ...base, slug: "a", startDate: "2026-12-01", endDate: undefined },
      { ...base, slug: "b", startDate: "2026-11-01", endDate: undefined },
      { ...base, slug: "c", startDate: "2025-01-01", endDate: undefined },
      { ...base, slug: "d", startDate: "2026-05-01", endDate: undefined },
    ];
    const { current, past } = splitByTime(list, now);
    expect(current.map((p) => p.slug)).toEqual(["b", "a"]);
    expect(past.map((p) => p.slug)).toEqual(["d", "c"]);
  });
});

describe("format", () => {
  it("날짜 범위", () => {
    expect(formatDateRange("2026-11-14", "2026-11-15")).toBe("2026.11.14 (토) – 11.15 (일)");
    expect(formatDateRange("2026-12-31", "2027-01-01")).toBe("2026.12.31 (목) – 2027.01.01 (금)");
    expect(formatDateRange("2026-11-14")).toBe("2026.11.14 (토)");
  });
  it("UTC 로 저장된 오픈 시각도 KST 로 보여준다", () => {
    expect(formatDateTime("2026-10-10T11:00:00.000Z")).toBe("2026.10.10 (토) 20:00");
  });
});

describe("KST input", () => {
  it("관리자 입력값을 한국 시간으로 저장하고 다시 보여준다", async () => {
    const { fromKstInput, toKstInput } = await import("./status");
    const iso = fromKstInput("2026-10-10T20:00")!;
    expect(new Date(iso).toISOString()).toBe("2026-10-10T11:00:00.000Z");
    expect(toKstInput("2026-10-10T11:00:00.000Z")).toBe("2026-10-10T20:00");
    expect(fromKstInput("")).toBeUndefined();
  });
});
