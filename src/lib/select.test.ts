import { describe, expect, it } from "vitest";
import { matchesQuery, pickHero, splitFeatured } from "./select";
import type { Performance } from "./types";

// 2026-10-04 12:00 KST
const now = new Date("2026-10-04T03:00:00Z");
const mk = (slug: string, startDate: string, extra: Partial<Performance> = {}): Performance => ({
  slug, title: slug, gallery: [], detailImages: [], startDate, ticketLinks: [], featured: false, ...extra,
});
const onsale = (slug: string, d: string, f = false) => mk(slug, d, { ticketOpenAt: "2026-09-01T20:00:00+09:00", featured: f });

describe("pickHero", () => {
  it("예매 중·오픈 예정이 있으면 그중 featured, 없으면 가장 가까운 날짜", () => {
    expect(pickHero([onsale("a", "2026-12-01"), onsale("b", "2026-11-01"), mk("p", "2025-01-01", { featured: true })], now)?.slug).toBe("b");
    expect(pickHero([onsale("a", "2026-12-01", true), onsale("b", "2026-11-01")], now)?.slug).toBe("a");
  });
  it("예매 중이 없으면 관리자가 고른 공연 (지난 공연이어도)", () => {
    expect(pickHero([mk("soon", "2027-01-01"), mk("old", "2025-05-01", { featured: true })], now)?.slug).toBe("old");
  });
  it("고른 것도 없으면 가장 가까운 공개 예정, 그다음 가장 최근 지난 공연", () => {
    expect(pickHero([mk("soon", "2027-01-01"), mk("old", "2025-05-01")], now)?.slug).toBe("soon");
    expect(pickHero([mk("old1", "2025-05-01"), mk("old2", "2026-05-01")], now)?.slug).toBe("old2");
    expect(pickHero([], now)).toBeUndefined();
  });
});

describe("splitFeatured", () => {
  it("다가오는 공연 + featured 지난 공연, 모자라면 최근 지난 공연으로 채우고 나머지는 ARCHIVE", () => {
    const list = [onsale("up", "2026-11-01"), mk("p1", "2026-05-01"), mk("p2", "2026-03-01"), mk("p3", "2025-01-01", { featured: true }), mk("p4", "2024-01-01")];
    const { featured, archive } = splitFeatured(list, now, 3);
    expect(featured.map((p) => p.slug)).toEqual(["up", "p3", "p1"]);
    expect(archive.map((p) => p.slug)).toEqual(["p2", "p4"]);
  });
});

describe("matchesQuery", () => {
  const p = mk("x", "2026-11-15", { title: "어쩌다 페스티벌", artist: "국카스텐, 소란", venue: "연세대학교 대강당" });
  it("공연명·출연·장소, 띄어쓰기·대소문자 무시", () => {
    expect(matchesQuery(p, "어쩌다페스티벌")).toBe(true);
    expect(matchesQuery(p, "국카스텐")).toBe(true);
    expect(matchesQuery(p, "연세대")).toBe(true);
    expect(matchesQuery(mk("y", "2026-01-01", { title: "BLUE HOUR" }), "blue hour")).toBe(true);
    expect(matchesQuery(p, "박창근")).toBe(false);
    expect(matchesQuery(p, "  ")).toBe(true);
  });
});
