import { parts } from "./parts";
import { getProject, projects } from "./projects";
import { PART_IDS, type HardwarePart, type Project } from "./types";

/** Returns human-readable problems with the content registry; empty means valid. */
export function validateContent(
  registry: readonly HardwarePart[] = parts,
  projectList: readonly Project[] = projects,
): string[] {
  const problems: string[] = [];

  const ids = registry.map((p) => p.id);
  if (new Set(ids).size !== ids.length) problems.push("Duplicate part ids");
  for (const id of PART_IDS) {
    if (!ids.includes(id)) problems.push(`Part "${id}" has no registry entry`);
  }

  const slugs = projectList.map((p) => p.slug);
  if (new Set(slugs).size !== slugs.length) problems.push("Duplicate project slugs");

  for (const part of registry) {
    const { section } = part;
    if (section.kind === "projects") {
      for (const slug of section.projectSlugs) {
        if (!getProject(slug))
          problems.push(`Part "${part.id}" references unknown project "${slug}"`);
      }
    }
    if (section.kind === "memory") {
      for (const item of section.current) {
        if (item.projectSlug && !getProject(item.projectSlug)) {
          problems.push(
            `Part "${part.id}" focus item references unknown project "${item.projectSlug}"`,
          );
        }
      }
    }
  }

  for (const project of projectList) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(project.slug)) {
      problems.push(`Project slug "${project.slug}" is not kebab-case`);
    }
    for (const link of project.links) {
      if (!link.href.startsWith("https://")) {
        problems.push(`Project "${project.slug}" link "${link.label}" is not https`);
      }
    }
  }

  return problems;
}
