import { describe, expect, it } from "vitest";
import { toPerformance } from "./normalize";

describe("toPerformance", () => {
  it("상세 이미지·사진은 문자열 배열과 Decap 의 [{ image }] 형태를 모두 받는다", () => {
    const p = toPerformance({
      title: "T",
      startDate: "2026-11-15",
      detailImages: [{ image: "/uploads/d1.jpg" }, "/uploads/d2.jpg", { image: "" }],
      gallery: ["/uploads/g1.jpg", null],
    });
    expect(p.detailImages).toEqual(["/uploads/d1.jpg", "/uploads/d2.jpg"]);
    expect(p.gallery).toEqual(["/uploads/g1.jpg"]);
  });

  it("상세 이미지가 없으면 빈 배열", () => {
    expect(toPerformance({ title: "T", startDate: "2026-11-15" }).detailImages).toEqual([]);
  });
});
