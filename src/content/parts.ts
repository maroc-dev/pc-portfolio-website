import { about } from "./sections/about";
import { aiGraphics } from "./sections/ai-graphics";
import { archive } from "./sections/archive";
import { contact } from "./sections/contact";
import { distributed } from "./sections/distributed";
import { memory } from "./sections/memory";
import { PART_IDS, type HardwarePart, type PartId } from "./types";

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
    topic: "AI and graphics",
    blurb: "Machine learning, AI tooling and real-time graphics projects.",
    appName: "accelerated.app",
    section: aiGraphics,
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
    blurb: "Everything I've built, sorted into drives.",
    appName: "files.app",
    section: archive,
  },
  {
    id: "server",
    label: "Server",
    hardwareName: "Mini server",
    heading: "Connected Systems",
    topic: "Distributed systems",
    blurb: "Systems that coordinate across machines, starting with this little server.",
    appName: "network.app",
    section: distributed,
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

export function getPart(id: PartId): HardwarePart {
  const part = byId.get(id);
  if (!part) throw new Error(`Unknown part: ${id}`);
  return part;
}
