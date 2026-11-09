import { about } from "./sections/about";
import { ai } from "./sections/ai";
import { archive } from "./sections/archive";
import { contact } from "./sections/contact";
import { memory } from "./sections/memory";
import { systems } from "./sections/systems";
import { PART_IDS, type HardwarePart, type PartId, type Section } from "./types";

/**
 * The single mapping between hardware and content. The scene looks parts up by `id`; meshes
 * (procedural now, Blender GLB later) must use the same id as their name.
 * Order here is the order used by the dock and navigation.
 */
export const parts: readonly HardwarePart[] = [
  {
    id: "cpu",
    label: "CPU",
    hardwareName: "Processor",
    heading: "The Core",
    topic: "About me",
    blurb: "Who I am, how I got here, and what I do away from the keyboard.",
    appName: "about.app",
    section: about,
  },
  {
    id: "gpu",
    label: "GPU",
    hardwareName: "Graphics card",
    heading: "Accelerated Ideas",
    topic: "Artificial intelligence",
    blurb: "The AI systems I build at work, and the models I run at home.",
    appName: "accelerated.app",
    section: ai,
  },
  {
    id: "ram",
    label: "RAM",
    hardwareName: "Memory",
    heading: "Active Memory",
    topic: "Now and skills",
    blurb: "What I'm working on right now, and the skills I have.",
    appName: "memory.app",
    section: memory,
  },
  {
    id: "ssd",
    label: "SSD",
    hardwareName: "Storage",
    heading: "Project Archives",
    topic: "Projects",
    blurb: "My biggest projects, what I'm building now, and everything else by category.",
    appName: "files.app",
    section: archive,
  },
  {
    id: "server",
    label: "Server",
    hardwareName: "Mini server",
    heading: "Connected Systems",
    topic: "Systems architecture",
    blurb: "Software built to scale, and the systems I've built to learn how.",
    appName: "network.app",
    section: systems,
  },
  {
    id: "io",
    label: "I/O",
    hardwareName: "Front ports",
    heading: "Connect",
    topic: "Contact",
    blurb: "How to reach me, plus my résumé.",
    appName: "connect.app",
    section: contact,
  },
];

const byId = new Map(parts.map((p) => [p.id, p]));

export function isPartId(value: unknown): value is PartId {
  return typeof value === "string" && (PART_IDS as readonly string[]).includes(value);
}

/** Element ids inside a section that links can open it at (see `SectionLink`). */
export function sectionAnchors(section: Section): string[] {
  if (section.kind === "ai") {
    return [
      "ai-professional",
      "ai-personal",
      ...section.professional.projects.map((p) => aiAnchor(p.id)),
    ];
  }
  if (section.kind === "about") {
    return ["about-journey", "about-education", "about-hobbies"];
  }
  if (section.kind === "memory") {
    return ["memory-now", "memory-skills", ...section.now.map((item) => nowAnchor(item.id))];
  }
  if (section.kind === "archive") {
    return ["archive-highlights", "archive-building", "archive-drives"];
  }
  if (section.kind === "systems") {
    return section.projects.map((project) => systemsAnchor(project.id));
  }
  return [];
}

/** The element id of a project in the systems section. */
export function systemsAnchor(projectId: string): string {
  return `systems-${projectId}`;
}

/** The element id of an item in the RAM section's "Right now". */
export function nowAnchor(itemId: string): string {
  return `now-${itemId}`;
}

/** The element id of a professional AI project's entry. */
export function aiAnchor(projectId: string): string {
  return `ai-${projectId}`;
}

export function getPart(id: PartId): HardwarePart {
  const part = byId.get(id);
  if (!part) throw new Error(`Unknown part: ${id}`);
  return part;
}
