import type { MemorySection } from "../types";

/**
 * RAM: what's loaded right now. `current` is active work; `skillGroups` are the skills Marco has.
 * Skills are seeded from languages used in his public repos. Tiers are left unset until Marco
 * confirms them, so nothing claims a level of experience he hasn't stated.
 */
export const memory: MemorySection = {
  kind: "memory",
  current: [
    {
      title: "This portfolio",
      detail: "A 3D machine built with React Three Fiber, where every part tells a story.",
    },
    {
      title: "Something I'm learning",
      detail: "Placeholder for whatever is on my desk this month.",
    },
  ],
  skillGroups: [
    {
      title: "Languages",
      skills: [
        { name: "Go" },
        { name: "C++" },
        { name: "Python" },
        { name: "C#" },
        { name: "C" },
        { name: "OCaml" },
        { name: "TypeScript" },
      ],
    },
    {
      title: "Frameworks and tools",
      skills: [{ name: "React" }, { name: "Unity" }, { name: "Postgres" }],
    },
  ],
  placeholder: true,
};
