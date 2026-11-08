import { parts, sectionAnchors } from "./parts";
import { getProject, projects } from "./projects";
import { PART_IDS, type HardwarePart, type Project } from "./types";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

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
    if (section.kind === "ai") {
      const ids = section.professional.projects.map((p) => p.id);
      if (new Set(ids).size !== ids.length) problems.push("Duplicate AI project ids");
      for (const id of ids) {
        if (!KEBAB.test(id)) problems.push(`AI project id "${id}" is not kebab-case`);
      }
      for (const project of section.professional.projects) {
        if (project.flow.length < 2) problems.push(`AI project "${project.id}" needs a flow`);
      }
    }
    if (section.kind === "about") {
      for (const stop of section.journey) {
        const link = stop.more;
        if (!link) continue;
        const target = registry.find((p) => p.id === link.part);
        if (!target)
          problems.push(`Journey stop "${stop.id}" links to unknown part "${link.part}"`);
        else if (link.anchor && !sectionAnchors(target.section).includes(link.anchor)) {
          problems.push(`Journey stop "${stop.id}" links to missing anchor "${link.anchor}"`);
        }
      }
      const stops = section.journey.map((stop) => stop.id);
      if (new Set(stops).size !== stops.length) problems.push("Duplicate journey stop ids");
      for (const id of stops) {
        if (!KEBAB.test(id)) problems.push(`Journey stop id "${id}" is not kebab-case`);
      }
      const photos = [
        section.portrait,
        ...section.journey.flatMap((stop) => (stop.photo ? [stop.photo] : [])),
        ...section.education.flatMap((school) => school.photos ?? []),
        ...section.hobbies.map((hobby) => hobby.photo),
      ];
      for (const photo of photos) {
        if (photo.placeholder) continue;
        if (!photo.src.startsWith("/"))
          problems.push(`Photo "${photo.caption}" is not a local file`);
        if (photo.credit && !photo.credit.href.startsWith("https://")) {
          problems.push(`Photo "${photo.caption}" credit link is not https`);
        }
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
    if (!KEBAB.test(project.slug)) {
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
