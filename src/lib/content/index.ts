import type { Company, Performance } from "../types";
import * as files from "./files";
import * as supabase from "./supabase";

// 홈페이지가 어디서 공연 정보를 읽을지: "files"(Decap CMS) | "supabase"(/admin)
const source = process.env.CONTENT_SOURCE === "supabase" ? supabase : files;

export async function getPerformances(): Promise<Performance[]> {
  return source.getPerformances();
}

export async function getPerformance(slug: string): Promise<Performance | undefined> {
  return (await source.getPerformances()).find((p) => p.slug === slug);
}

export async function getCompanies(): Promise<Company[]> {
  return (await source.getCompanies()).sort((a, b) => a.order - b.order);
}
