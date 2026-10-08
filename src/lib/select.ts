import { getStatus, splitByTime } from "./status";
import type { Performance } from "./types";

const byFeaturedFirst = (a: Performance, b: Performance) => Number(b.featured) - Number(a.featured);

/**
 * 첫 화면 가운데 대표 공연.
 * 예매 중·오픈 예정 → 관리자가 고른(featured) 공연 → 가장 가까운 공개 예정 → 가장 최근 지난 공연.
 * 같은 단계 안에서는 featured 먼저, 그다음 날짜순.
 */
export function pickHero(list: Performance[], now: Date = new Date()): Performance | undefined {
  const { current, past } = splitByTime(list, now);
  const ticketing = current.filter((p) => ["onsale", "opensoon"].includes(getStatus(p, now)));
  if (ticketing.length) return [...ticketing].sort(byFeaturedFirst)[0];
  const picked = [...current, ...past].find((p) => p.featured);
  return picked ?? current[0] ?? past[0];
}

const STATUS_RANK: Record<string, number> = { onsale: 0, opensoon: 1 };

/**
 * 첫 화면 슬라이드. 예매 중·오픈 예정 공연만 (featured → 예매 중 → 오픈 예정 → 날짜순).
 * 하나도 없으면 pickHero 가 고른 공연 한 장.
 */
export function pickHeroSlides(list: Performance[], now: Date = new Date()): Performance[] {
  const { current } = splitByTime(list, now);
  const ticketing = current.filter((p) => getStatus(p, now) in STATUS_RANK);
  if (ticketing.length) {
    return [...ticketing].sort(
      (a, b) => byFeaturedFirst(a, b) || STATUS_RANK[getStatus(a, now)] - STATUS_RANK[getStatus(b, now)],
    );
  }
  const fallback = pickHero(list, now);
  return fallback ? [fallback] : [];
}

/**
 * FEATURED PERFORMANCES 줄과 ARCHIVE 를 나눈다.
 * 다가오는 공연 전부 + featured 지난 공연, 모자라면 최근 지난 공연으로 min 개까지 채운다. 나머지 지난 공연은 ARCHIVE.
 */
export function splitFeatured(list: Performance[], now: Date = new Date(), min = 5) {
  const { current, past } = splitByTime(list, now);
  const featured = [...current, ...past.filter((p) => p.featured)];
  for (const p of past) {
    if (featured.length >= min) break;
    if (!featured.includes(p)) featured.push(p);
  }
  return { featured, archive: past.filter((p) => !featured.includes(p)) };
}

/** 공연명·부제·출연·장소에 검색어가 들어 있는지 (대소문자·띄어쓰기 무시) */
export function matchesQuery(p: Performance, q: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");
  const needle = norm(q);
  if (!needle) return true;
  return [p.title, p.subtitle, p.artist, p.venue].some((f) => f && norm(f).includes(needle));
}
