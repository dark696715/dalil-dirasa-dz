import { describe, expect, it } from "vitest";
import { externalResources, isAllowedResourceUrl, stages } from "../data/external-resources";

describe("دليل الدراسة الجزائرية: فهرس الروابط", () => {
  it("يضم الموارد في الأطوار الثلاثة", () => {
    const covered = new Set(externalResources.map((item) => item.stage));
    expect(stages.every((stage) => covered.has(stage.label))).toBe(true);
  });

  it("يحافظ على تصنيف ونوع ورابط HTTPS لكل مورد", () => {
    expect(externalResources.length).toBeGreaterThan(10);
    for (const item of externalResources) {
      expect(item.title.length).toBeGreaterThan(3);
      expect(item.source.length).toBeGreaterThan(2);
      expect(item.url.startsWith("https://")).toBe(true);
      expect(item.grade.length).toBeGreaterThan(0);
      expect(item.subject.length).toBeGreaterThan(0);
    }
  });

  it("يسمح بالمصادر المعتمدة ويرفض الروابط الخارجية", () => {
    expect(isAllowedResourceUrl("https://www.education.gov.dz/")).toBe(true);
    expect(isAllowedResourceUrl("https://exams.elkhadra.com/")).toBe(true);
    expect(isAllowedResourceUrl("http://education.gov.dz/")).toBe(false);
    expect(isAllowedResourceUrl("https://example.com/resource")).toBe(false);
  });
});
