// CONTENT_SOURCE=files — content/ 폴더의 JSON (Decap CMS 가 이 파일들을 편집한다)
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Company, Performance } from "../types";
import { toCompany, toPerformance } from "./normalize";

const ROOT = path.join(process.cwd(), "content");

async function readFolder(folder: string) {
  const dir = path.join(ROOT, folder);
  const names = (await readdir(dir).catch(() => [] as string[])).filter((n) => n.endsWith(".json"));
  return Promise.all(
    names.map(async (name) => ({
      slug: name.replace(/\.json$/, ""),
      data: JSON.parse(await readFile(path.join(dir, name), "utf8")),
    })),
  );
}

export async function getPerformances(): Promise<Performance[]> {
  return (await readFolder("performances")).map((f) => toPerformance(f.data, f.slug));
}

export async function getCompanies(): Promise<Company[]> {
  return (await readFolder("companies")).map((f) => toCompany(f.data, f.slug));
}
