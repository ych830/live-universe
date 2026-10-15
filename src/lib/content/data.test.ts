import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// content/performances/*.json 실제 데이터 점검
const dir = path.join(process.cwd(), "content/performances");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

describe("공연 데이터", () => {
  it.each(files)("%s: 출연은 전원 적는다 ('○○ 외' 금지, 사용자 요청)", (f) => {
    const { artist } = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    expect(artist ?? "").not.toMatch(/\s외$|\s외\s/);
  });
});
