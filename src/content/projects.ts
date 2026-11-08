import type { Project } from "./types";

/**
 * Seeded from Marco's public GitHub repositories: titles, languages and summaries come from the
 * repos themselves. Everything deeper (problem, role, architecture, outcomes) is left empty until
 * Marco writes it, so every entry stays `placeholder: true`.
 */
const GITHUB = "https://github.com/maroc-dev";

export const projects: Project[] = [
  {
    slug: "distributed-training-system",
    title: "Distributed training system",
    summary:
      "A fault-tolerant distributed training system in Go, with a replicated parameter server, built for Rutgers CS 417.",
    kind: "academic",
    category: "distributed",
    stack: ["Go"],
    links: [{ label: "Source on GitHub", href: `${GITHUB}/distributed-training-system-in-golang` }],
    placeholder: true,
  },
  {
    slug: "goosedb",
    title: "goosedb",
    summary: "A database for querying and storing media, written in C++23.",
    kind: "personal",
    category: "data-backend",
    stack: ["C++23"],
    links: [{ label: "Source on GitHub", href: `${GITHUB}/goosedb` }],
    placeholder: true,
  },
  {
    slug: "solar-system-explorer",
    title: "Solar System Explorer",
    summary: "A solar system explorer built in Unity.",
    kind: "personal",
    category: "ai-graphics",
    stack: ["C#", "Unity"],
    links: [{ label: "Source on GitHub", href: `${GITHUB}/Solar-System-Explorer` }],
    placeholder: true,
  },
  {
    slug: "face-and-digit-classification",
    title: "Face and digit classification",
    summary: "Face and digit classification, built for Rutgers CS440.",
    kind: "academic",
    category: "ai-graphics",
    stack: ["Python"],
    links: [{ label: "Source on GitHub", href: `${GITHUB}/Face-and-Digit-Classification` }],
    placeholder: true,
  },
  {
    slug: "pratt-expression-evaluator",
    title: "Pratt-parsing expression evaluator",
    summary: "A C++23 program that evaluates a series of expressions using Pratt parsing.",
    kind: "personal",
    category: "languages-tools",
    stack: ["C++23"],
    links: [
      { label: "Source on GitHub", href: `${GITHUB}/cpp-pratt-parsing-expression-evaluator` },
    ],
    placeholder: true,
  },
  {
    slug: "password-manager",
    title: "Password manager",
    summary: "A simple, locally hosted password manager built with Go, Postgres and React.",
    kind: "personal",
    category: "data-backend",
    stack: ["Go", "Postgres", "React"],
    links: [{ label: "Source on GitHub", href: `${GITHUB}/simple_password_manager` }],
    placeholder: true,
  },
  {
    slug: "8-puzzle-solver",
    title: "8-puzzle solver",
    summary: "A solver for the 8-puzzle using A* and several heuristics.",
    kind: "personal",
    category: "languages-tools",
    stack: ["A* search"],
    links: [{ label: "Source on GitHub", href: `${GITHUB}/8-puzzle-solver` }],
    placeholder: true,
  },
];

const bySlug = new Map(projects.map((p) => [p.slug, p]));

export function getProject(slug: string): Project | undefined {
  return bySlug.get(slug);
}

export function getProjects(slugs: readonly string[]): Project[] {
  return slugs.map(getProject).filter((p): p is Project => p !== undefined);
}
