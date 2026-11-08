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
      p.id === "server" && p.section.kind === "projects"
        ? { ...p, section: { ...p.section, projectSlugs: ["does-not-exist"] } }
        : p,
    );
    expect(validateContent(broken)).toContain(
      'Part "server" references unknown project "does-not-exist"',
    );
  });

  it("reports an About link to a spot that doesn't exist", () => {
    const broken = parts.map((p) =>
      p.section.kind === "about"
        ? {
            ...p,
            section: {
              ...p.section,
              journey: p.section.journey.map((stop) =>
                stop.id === "att"
                  ? { ...stop, more: { label: "x", part: "gpu" as const, anchor: "ai-nope" } }
                  : stop,
              ),
            },
          }
        : p,
    );
    expect(validateContent(broken)).toContain(
      'Journey stop "att" links to missing anchor "ai-nope"',
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
