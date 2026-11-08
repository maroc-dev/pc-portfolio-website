/**
 * Content model for the portfolio. Pure data: no React, no three.
 *
 * Anything not yet confirmed by Marco carries `placeholder: true` so the UI can mark it as a
 * draft and so it is easy to find with a search before launch.
 */

export const PART_IDS = ["cpu", "gpu", "ram", "ssd", "server", "io"] as const;
export type PartId = (typeof PART_IDS)[number];

export type ProjectKind = "personal" | "academic" | "professional" | "research";

export type ProjectCategory = "ai-graphics" | "distributed" | "data-backend" | "languages-tools";

export interface ProjectLink {
  label: string;
  href: string;
}

/** Case study in the spec's format. Optional fields render only when present. */
export interface Project {
  slug: string;
  title: string;
  summary: string;
  kind: ProjectKind;
  category: ProjectCategory;
  stack: string[];
  problem?: string;
  role?: string;
  architecture?: string;
  challenges?: string[];
  solutions?: string[];
  outcomes?: string[];
  links: ProjectLink[];
  placeholder: boolean;
}

/** Where a photo came from, when it isn't Marco's own. */
export interface PhotoCredit {
  author: string;
  license: string;
  /** The photo's source page, e.g. on Wikimedia Commons. */
  href: string;
}

/**
 * A photo in the About story. Until Marco supplies his own pictures, a slot is a placeholder: it
 * keeps its shape and caption so the layout and the story read the same once the photo arrives.
 */
export type Photo = {
  /** Intrinsic size (or just the aspect ratio, for a placeholder slot). */
  width: number;
  height: number;
  caption: string;
} & (
  { placeholder: true } | { placeholder: false; src: string; alt: string; credit?: PhotoCredit }
);

/** A competition result, e.g. "1st" in "SkillsUSA Web Design". */
export interface Placing {
  place: string;
  event: string;
}

/** Something Marco built, named and described in a line. */
export interface BuiltThing {
  name: string;
  detail: string;
}

/** One stop on the journey. Stops are in the order they're told, not strictly by date. */
export interface JourneyStop {
  /** Kebab-case and unique: used for in-page jumps. */
  id: string;
  /** Short name on the stop's label tape, e.g. "Rutgers". */
  place: string;
  when: string;
  title: string;
  story: string[];
  placings?: Placing[];
  built?: BuiltThing[];
  photo?: Photo;
  /** A hard stretch: the journey's line runs dashed through it. */
  pause?: boolean;
  /** Where to read more: another part's section, opened at an element id. */
  more?: SectionLink;
}

/** A link into another part's section, optionally to a specific element in it. */
export interface SectionLink {
  label: string;
  part: PartId;
  anchor?: string;
}

export interface Course {
  /** As Rutgers numbers it, e.g. "CS 417". */
  code: string;
  name: string;
  takeaway: string;
  /** Being taken this semester. */
  current?: boolean;
}

export interface School {
  name: string;
  degree: string;
  where: string;
  when: string;
  gpa: string;
  honours: string[];
  summary: string;
  courses?: Course[];
  highlights?: string[];
  photos?: Photo[];
}

export interface Hobby {
  name: string;
  detail: string;
  photo: Photo;
}

/** CPU: who Marco is, told as a journey, then education and life outside code. */
export interface AboutSection {
  kind: "about";
  portrait: Photo;
  intro: string[];
  journey: JourneyStop[];
  education: School[];
  hobbies: Hobby[];
  placeholder: boolean;
}

export interface ProjectsSection {
  kind: "projects";
  intro: string;
  projectSlugs: string[];
  placeholder: boolean;
}

/** How Marco knows a skill. Deliberately not a percentage. */
export type SkillTier = "professional" | "projects" | "familiar" | "learning";

export interface Skill {
  name: string;
  tier?: SkillTier;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export interface FocusItem {
  title: string;
  detail: string;
  projectSlug?: string;
}

/** RAM: what Marco is working on right now, plus the skills he has. */
export interface MemorySection {
  kind: "memory";
  current: FocusItem[];
  skillGroups: SkillGroup[];
  placeholder: boolean;
}

export interface Drive {
  id: string;
  label: string;
  category: ProjectCategory;
}

export interface ArchiveSection {
  kind: "archive";
  intro: string;
  drives: Drive[];
  placeholder: boolean;
}

export interface ContactLink {
  label: string;
  href?: string;
  detail: string;
}

export interface ContactSection {
  kind: "contact";
  intro: string;
  links: ContactLink[];
  placeholder: boolean;
}

/** What a box in an architecture diagram stands for; each kind has its own look. */
export type ArchKind = "person" | "service" | "store" | "external";

/** A component, placed on the diagram's grid (1-based column and row). */
export interface ArchNode {
  id: string;
  label: string;
  detail?: string;
  kind: ArchKind;
  col: number;
  row: number;
  rowSpan?: number;
}

/** A connection between two components, drawn as an arrow from `from` to `to`. */
export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  /** Arrowheads at both ends: a two-way exchange. */
  both?: boolean;
}

/** A dashed boundary around a block of cells, e.g. "Runs locally". */
export interface ArchGroup {
  label: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
}

/** A simplified box-and-arrow architecture diagram. */
export interface Architecture {
  cols: number;
  rows: number;
  nodes: ArchNode[];
  edges: ArchEdge[];
  groups?: ArchGroup[];
}

/** Example outputs a project can show. Each is made-up data, drawn by the UI. */
export type ProjectSample = "network-diagram";

/** A professional AI project, shown as an expandable entry with its architecture. */
export interface AiProject {
  /** Kebab-case and unique: the entry's element id is `ai-${id}`. */
  id: string;
  name: string;
  /** Where it was built, shown on label tape, e.g. "AT&T Labs". */
  org: string;
  summary: string;
  points: string[];
  stack: string[];
  architecture: Architecture;
  sample?: ProjectSample;
}

/** A machine Marco runs models on at home. */
export interface Rig {
  name: string;
  detail: string;
  photo: Photo;
}

/** GPU: AI, professionally and for fun. */
export interface AiSection {
  kind: "ai";
  professional: { intro: string[]; projects: AiProject[] };
  personal: { intro: string[]; rigs: Rig[] };
  placeholder: boolean;
}

export type Section =
  AboutSection | AiSection | ProjectsSection | MemorySection | ArchiveSection | ContactSection;

/** A selectable piece of hardware and the section it opens. */
export interface HardwarePart {
  id: PartId;
  /** Short hardware name shown on labels, e.g. "CPU". */
  label: string;
  /** Plain-language hardware name, e.g. "Processor". */
  hardwareName: string;
  /** Section heading, e.g. "The Core". */
  heading: string;
  /** What the visitor will find, e.g. "About me". */
  topic: string;
  /** One sentence for the hover label and dock tooltip. */
  blurb: string;
  /** Window title on the monitor, e.g. "about.app". */
  appName: string;
  section: Section;
}

export interface Profile {
  name: string;
  /** Short line under the name on the monitor's idle screen. */
  greeting: string;
  placeholder: boolean;
}
