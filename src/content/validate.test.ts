import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parts } from "./parts";
import { projects } from "./projects";
import { validateArchitecture, validateContent } from "./validate";

describe("content registry", () => {
  it("is valid", () => {
    expect(validateContent()).toEqual([]);
  });

  it("reports a missing project reference", () => {
    const broken = parts.map((p) =>
      p.id === "server"
        ? {
            ...p,
            section: {
              kind: "projects" as const,
              intro: "",
              projectSlugs: ["does-not-exist"],
              placeholder: false,
            },
          }
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

  it("reports a RAM diagram span past its layers", () => {
    const broken = parts.map((p) =>
      p.section.kind === "memory"
        ? {
            ...p,
            section: {
              ...p.section,
              now: p.section.now.map((item) =>
                item.diagram
                  ? {
                      ...item,
                      diagram: {
                        ...item.diagram,
                        spans: [{ label: "Too far", note: "", from: 4, to: 9 }],
                      },
                    }
                  : item,
              ),
            },
          }
        : p,
    );
    expect(validateContent(broken)).toContain(
      'RAM item "databases" diagram span "Too far" is outside its layers',
    );
  });

  it("reports a systems diagram arrow to a box that doesn't exist", () => {
    const broken = parts.map((p) =>
      p.section.kind === "systems"
        ? {
            ...p,
            section: {
              ...p.section,
              projects: p.section.projects.map((project) =>
                project.architecture
                  ? {
                      ...project,
                      architecture: {
                        ...project.architecture,
                        edges: [{ from: "nowhere", to: "nowhere" }],
                      },
                    }
                  : project,
              ),
            },
          }
        : p,
    );
    expect(validateContent(broken)).toContain(
      'Systems project "draftly": arrow uses unknown box "nowhere"',
    );
  });

  it("reports a featured project that doesn't exist", () => {
    const broken = parts.map((p) =>
      p.section.kind === "archive" ? { ...p, section: { ...p.section, highlights: ["nope"] } } : p,
    );
    expect(validateContent(broken)).toContain('Part "ssd" features unknown project "nope"');
  });

  it("reports a drive with nothing left on it", () => {
    // Every database project is featured above the drives, so a databases drive would be empty.
    const broken = parts.map((p) =>
      p.section.kind === "archive"
        ? {
            ...p,
            section: {
              ...p.section,
              drives: [{ id: "Z", label: "Empty", blurb: "", category: "databases" as const }],
            },
          }
        : p,
    );
    expect(validateContent(broken)).toContain("Drive Z has no projects");
  });

  it("links a résumé that's really there", () => {
    const section = parts.find((p) => p.id === "io")!.section;
    if (section.kind !== "contact") throw new Error("I/O should be the contact section");
    expect(existsSync(`public${section.resume.href}`)).toBe(true);
  });

  it("never lets a phone number into the content", () => {
    const broken = parts.map((p) =>
      p.section.kind === "contact"
        ? { ...p, section: { ...p.section, intro: ["Call me at 555-123-4567."] } }
        : p,
    );
    expect(validateContent(broken)).toContain("Content contains a phone number");
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

  it("reports architecture boxes that overlap or arrows to nowhere", () => {
    const problems = validateArchitecture(
      {
        cols: 2,
        rows: 1,
        nodes: [
          { id: "a", label: "A", kind: "service", col: 1, row: 1 },
          { id: "b", label: "B", kind: "service", col: 1, row: 1 },
        ],
        edges: [{ from: "a", to: "c" }],
      },
      "Test",
    );
    expect(problems).toEqual([
      'Test: box "b" overlaps another box',
      'Test: arrow uses unknown box "c"',
    ]);
  });
});
