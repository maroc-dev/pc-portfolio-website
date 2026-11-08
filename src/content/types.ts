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

export interface Milestone {
  when: string;
  title: string;
  detail?: string;
}

export interface AboutSection {
  kind: "about";
  intro: string[];
  timeline: Milestone[];
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

export type Section =
  AboutSection | ProjectsSection | MemorySection | ArchiveSection | ContactSection;

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
