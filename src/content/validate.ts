import { parts, sectionAnchors } from "./parts";
import { getProject, projects } from "./projects";
import {
  PART_IDS,
  type Architecture,
  type HardwarePart,
  type Project,
  type SectionLink,
} from "./types";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Every box fits the grid without sharing a cell, and every arrow joins two real boxes. */
export function validateArchitecture(arch: Architecture, where: string): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const taken = new Set<string>();
  for (const node of arch.nodes) {
    if (ids.has(node.id)) problems.push(`${where}: duplicate box "${node.id}"`);
    ids.add(node.id);
    const lastRow = node.row + (node.rowSpan ?? 1) - 1;
    if (node.col < 1 || node.col > arch.cols || node.row < 1 || lastRow > arch.rows) {
      problems.push(`${where}: box "${node.id}" is outside the grid`);
    }
    for (let row = node.row; row <= lastRow; row++) {
      const cell = `${node.col},${row}`;
      if (taken.has(cell)) problems.push(`${where}: box "${node.id}" overlaps another box`);
      taken.add(cell);
    }
  }
  for (const edge of arch.edges) {
    for (const end of [edge.from, edge.to]) {
      if (!ids.has(end)) problems.push(`${where}: arrow uses unknown box "${end}"`);
    }
  }
  for (const group of arch.groups ?? []) {
    if (group.col + group.colSpan - 1 > arch.cols || group.row + group.rowSpan - 1 > arch.rows) {
      problems.push(`${where}: group "${group.label}" is outside the grid`);
    }
  }
  return problems;
}

/** A link into another section points at a real part and, if given, a real anchor in it. */
function validateSectionLink(
  link: SectionLink,
  where: string,
  registry: readonly HardwarePart[],
): string[] {
  const target = registry.find((p) => p.id === link.part);
  if (!target) return [`${where} links to unknown part "${link.part}"`];
  if (link.anchor && !sectionAnchors(target.section).includes(link.anchor)) {
    return [`${where} links to missing anchor "${link.anchor}"`];
  }
  return [];
}

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
        problems.push(...validateArchitecture(project.architecture, `AI project "${project.id}"`));
      }
    }
    if (section.kind === "about") {
      for (const stop of section.journey) {
        if (stop.more) {
          problems.push(...validateSectionLink(stop.more, `Journey stop "${stop.id}"`, registry));
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
    if (section.kind === "systems") {
      const ids = section.projects.map((p) => p.id);
      if (new Set(ids).size !== ids.length) problems.push("Duplicate systems project ids");
      for (const project of section.projects) {
        const where = `Systems project "${project.id}"`;
        if (!KEBAB.test(project.id)) problems.push(`${where} id is not kebab-case`);
        if (project.architecture) {
          problems.push(...validateArchitecture(project.architecture, where));
        }
        if (project.more) problems.push(...validateSectionLink(project.more, where, registry));
        for (const link of project.links) {
          if (!link.href.startsWith("https://")) {
            problems.push(`${where} link "${link.label}" is not https`);
          }
        }
      }
    }
    if (section.kind === "memory") {
      const ids = section.now.map((item) => item.id);
      if (new Set(ids).size !== ids.length) problems.push("Duplicate RAM item ids");
      for (const item of section.now) {
        const where = `RAM item "${item.id}"`;
        if (!KEBAB.test(item.id)) problems.push(`${where} id is not kebab-case`);
        if (item.more) problems.push(...validateSectionLink(item.more, where, registry));
        const links = [...(item.links ?? []), ...(item.projects ?? []).flatMap((p) => p.links)];
        for (const link of links) {
          if (!link.href.startsWith("https://")) {
            problems.push(`${where} link "${link.label}" is not https`);
          }
        }
        for (const span of item.diagram?.spans ?? []) {
          const count = item.diagram!.layers.length;
          if (span.from < 1 || span.to > count || span.from > span.to) {
            problems.push(`${where} diagram span "${span.label}" is outside its layers`);
          }
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
