import type { Company, Performance, TicketLink } from "../types";

type Raw = Record<string, unknown>;

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;

/** Decap 의 date 위젯은 "2026-11-14" 또는 ISO 문자열을 줄 수 있어 앞 10자리만 쓴다 */
const ymd = (v: unknown): string | undefined => str(v)?.slice(0, 10);

export function toPerformance(raw: Raw, fallbackSlug = ""): Performance {
  const links = Array.isArray(raw.ticketLinks) ? (raw.ticketLinks as Raw[]) : [];
  const gallery = Array.isArray(raw.gallery) ? raw.gallery : [];
  return {
    slug: str(raw.slug) ?? fallbackSlug,
    title: str(raw.title) ?? "(제목 없음)",
    subtitle: str(raw.subtitle),
    artist: str(raw.artist),
    company: str(raw.company),
    poster: str(raw.poster),
    // Decap 리스트 위젯은 [{ image: "..." }] 형태로 저장한다
    gallery: gallery
      .map((g) => (typeof g === "string" ? g : str((g as Raw)?.image)))
      .filter((g): g is string => !!g),
    startDate: ymd(raw.startDate) ?? "1970-01-01",
    endDate: ymd(raw.endDate),
    timeText: str(raw.timeText),
    venue: str(raw.venue),
    ageRating: str(raw.ageRating),
    runningTime: str(raw.runningTime),
    price: str(raw.price),
    ticketOpenAt: str(raw.ticketOpenAt),
    ticketLinks: links
      .map((l): TicketLink => ({ vendor: str(l.vendor) ?? "etc", label: str(l.label), url: str(l.url) ?? "" }))
      .filter((l) => l.url !== ""),
    featured: raw.featured === true,
    description: str(raw.description),
  };
}

export function toCompany(raw: Raw, fallbackSlug = ""): Company {
  return {
    slug: str(raw.slug) ?? fallbackSlug,
    name: str(raw.name) ?? fallbackSlug,
    nameEn: str(raw.nameEn),
    tagline: str(raw.tagline),
    description: str(raw.description),
    logo: str(raw.logo),
    website: str(raw.website),
    instagram: str(raw.instagram),
    order: typeof raw.order === "number" ? raw.order : 0,
  };
}
