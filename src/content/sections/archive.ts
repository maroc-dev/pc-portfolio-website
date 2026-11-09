import type { ArchiveSection } from "../types";

/**
 * SSD: the two big projects, then what's being built, then every project on its drive. Each
 * drive is one category; projects already shown above it aren't repeated.
 */
export const archive: ArchiveSection = {
  kind: "archive",
  intro:
    "Everything I've built and kept, from the big team projects to the class assignments that taught me how computers actually work. Each one has a short explanation, a diagram of how it fits together and the stack behind it.",
  highlights: ["draftly", "optisql"],
  building: "goosedb",
  drives: [
    {
      id: "A",
      label: "Systems programming",
      blurb: "Programs in C that work close to the machine: processes, memory and caches.",
      category: "systems-c",
    },
    {
      id: "B",
      label: "AI and machine learning",
      blurb: "Search, classifiers built from scratch, and tools for AI agents.",
      category: "ai-ml",
    },
    {
      id: "C",
      label: "Distributed systems and backend",
      blurb: "Services and systems that run across more than one process or machine.",
      category: "distributed-backend",
    },
    {
      id: "D",
      label: "Languages and interpreters",
      blurb: "Lexers, parsers and evaluators: how code turns into answers.",
      category: "languages",
    },
    {
      id: "E",
      label: "Apps and games",
      blurb: "Things you can open and use, from a restaurant app to a solar system.",
      category: "apps-games",
    },
  ],
  placeholder: false,
};
