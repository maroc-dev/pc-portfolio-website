import { describe, expect, it } from "vitest";
import { parts } from "./parts";
import { projects } from "./projects";
import { validateContent } from "./validate";

describe("content registry", () => {
  it("is valid", () => {
    expect(validateContent()).toEqual([]);
  });

  it("reports a missing project reference", () => {
    const broken = parts.map((p) =>
      p.id === "gpu" && p.section.kind === "projects"
        ? { ...p, section: { ...p.section, projectSlugs: ["does-not-exist"] } }
        : p,
    );
    expect(validateContent(broken)).toContain(
      'Part "gpu" references unknown project "does-not-exist"',
    );
  });

  it("reports a missing part", () => {
    expect(validateContent(parts.filter((p) => p.id !== "ram"))).toContain(
      'Part "ram" has no registry entry',
    );
  });

  it("reports duplicate project slugs", () => {
    expect(validateContent(parts, [...projects, projects[0]!])).toContain(
      "Duplicate project slugs",
    );
  });
});
