import type { ArchiveSection } from "../types";

export const archive: ArchiveSection = {
  kind: "archive",
  intro: "Everything I've built and kept. Each drive holds one kind of project.",
  drives: [
    { id: "A", label: "AI and graphics", category: "ai-graphics" },
    { id: "B", label: "Distributed systems", category: "distributed" },
    { id: "C", label: "Databases and backend", category: "data-backend" },
    { id: "D", label: "Languages and tools", category: "languages-tools" },
  ],
  placeholder: true,
};
