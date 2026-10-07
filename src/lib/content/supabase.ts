// CONTENT_SOURCE=supabase — Supabase DB (/admin 이 이 테이블을 편집한다)
import { createClient } from "@supabase/supabase-js";
import type { Company, Performance } from "../types";
import { toCompany, toPerformance } from "./normalize";

type Row = Record<string, unknown>;

export function rowToPerformance(r: Row): Performance {
  return toPerformance({
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle,
    artist: r.artist,
    company: r.company_slug,
    poster: r.poster,
    gallery: r.gallery,
    detailImages: r.detail_images,
    startDate: r.start_date,
    endDate: r.end_date,
    timeText: r.time_text,
    venue: r.venue,
    ageRating: r.age_rating,
    runningTime: r.running_time,
    price: r.price,
    ticketOpenAt: r.ticket_open_at,
    ticketLinks: r.ticket_links,
    featured: r.featured,
    description: r.description,
  });
}

export function performanceToRow(p: Performance): Row {
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle ?? null,
    artist: p.artist ?? null,
    company_slug: p.company ?? null,
    poster: p.poster ?? null,
    gallery: p.gallery,
    detail_images: p.detailImages,
    start_date: p.startDate,
    end_date: p.endDate ?? null,
    time_text: p.timeText ?? null,
    venue: p.venue ?? null,
    age_rating: p.ageRating ?? null,
    running_time: p.runningTime ?? null,
    price: p.price ?? null,
    ticket_open_at: p.ticketOpenAt ?? null,
    ticket_links: p.ticketLinks,
    featured: p.featured,
    description: p.description ?? null,
  };
}

export function rowToCompany(r: Row): Company {
  return toCompany({
    slug: r.slug,
    name: r.name,
    nameEn: r.name_en,
    tagline: r.tagline,
    description: r.description,
    logo: r.logo,
    website: r.website,
    instagram: r.instagram,
    order: r.sort_order,
  });
}

export function companyToRow(c: Company): Row {
  return {
    slug: c.slug,
    name: c.name,
    name_en: c.nameEn ?? null,
    tagline: c.tagline ?? null,
    description: c.description ?? null,
    logo: c.logo ?? null,
    website: c.website ?? null,
    instagram: c.instagram ?? null,
    sort_order: c.order,
  };
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("CONTENT_SOURCE=supabase 인데 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 가 없습니다.");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getPerformances(): Promise<Performance[]> {
  const { data, error } = await client().from("performances").select("*");
  if (error) throw error;
  return (data ?? []).map(rowToPerformance);
}

export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await client().from("companies").select("*");
  if (error) throw error;
  return (data ?? []).map(rowToCompany);
}
