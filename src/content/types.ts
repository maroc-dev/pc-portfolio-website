/**
 * Content model for the portfolio. Pure data: no React, no three.
 *
 * Anything not yet confirmed by Marco carries `placeholder: true` so the UI can mark it as a
 * draft and so it is easy to find with a search before launch.
 */

export const PART_IDS = ["cpu", "gpu", "ram", "ssd", "server", "io"] as const;
export type PartId = (typeof PART_IDS)[number];

export type ProjectKind = "personal" | "academic" | "professional" | "research";

export type ProjectCategory =
  "systems-c" | "languages" | "ai-ml" | "distributed-backend" | "databases" | "apps-games";

export interface ProjectLink {
  label: string;
  href: string;
}

/** One chunk of a heap: its full size (header included) and whether it's in use. */
export interface HeapChunk {
  size: number;
  used: boolean;
  /** The variable pointing into it, e.g. "a". */
  name?: string;
}

/** The heap after one call, e.g. `b = malloc(100)`. */
export interface HeapStep {
  call: string;
  note: string;
  chunks: HeapChunk[];
}

/** A box in a chain of linked structs, e.g. one parsed command. */
export interface ChainNode {
  title: string;
  fields: { label: string; value: string }[];
}

/**
 * An example that shows a project working: real output, real data or a picture of its insides.
 * Everything in one comes from running the project or from its repo, never made up.
 */
export type ProjectVisual =
  | { kind: "terminal"; title: string; caption?: string; lines: string[] }
  | { kind: "code"; title: string; caption?: string; code: string }
  | { kind: "heap"; title: string; caption?: string; steps: HeapStep[] }
  | { kind: "chain"; title: string; caption?: string; nodes: ChainNode[]; end: string }
  | { kind: "diagram"; title: string; architecture: Architecture }
  | {
      kind: "table";
      title: string;
      caption?: string;
      columns: string[];
      rows: string[][];
      /** Columns (0-based) that hold code or terminal text. */
      mono?: number[];
    }
  | { kind: "pixels"; title: string; caption?: string; rows: string[] }
  | {
      kind: "image";
      title: string;
      caption?: string;
      src: string;
      alt: string;
      width: number;
      height: number;
    }
  | { kind: "ot-example" };

/**
 * A project from Marco's GitHub (or one he built with friends), written from the repo itself:
 * what it is, how it works, the stack and a simplified diagram.
 */
export interface Project {
  slug: string;
  title: string;
  /** One sentence: what it is. */
  summary: string;
  kind: ProjectKind;
  category: ProjectCategory;
  /** Where it's from, on label tape, e.g. "Rutgers CS 440" or "With Richard Baah". */
  tag: string;
  /** How it works, in a few short paragraphs. */
  details: string[];
  /** Notable features or results. */
  highlights?: string[];
  stats?: Stat[];
  stack: string[];
  diagram?: Architecture;
  /** Examples of it working, shown under "See it work". */
  visuals?: ProjectVisual[];
  links: ProjectLink[];
  /** Where it's covered in more depth elsewhere on the site. */
  more?: SectionLink;
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

/**
 * What's known about how Marco uses a skill. Deliberately not a percentage, and only set where
 * his résumé or notes say so: no tier makes no claim either way.
 */
export type SkillTier = "professional" | "learning";

export interface Skill {
  name: string;
  tier?: SkillTier;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

/** A project tied to something Marco is doing now, e.g. a database he's building. */
export interface NowProject {
  name: string;
  /** Where it stands, on label tape, e.g. "Building now". */
  status: string;
  detail: string[];
  links: ProjectLink[];
}

/** One layer of a system, top to bottom, for a layer diagram. */
export interface Layer {
  name: string;
  detail: string;
}

/** A bracket beside a run of layers: which project covers them (1-based, inclusive). */
export interface LayerSpan {
  label: string;
  note: string;
  from: number;
  to: number;
  /** The one being worked on right now: drawn with yellow tape. */
  active?: boolean;
}

/** A simplified stack of layers with the projects that cover them. */
export interface LayerDiagram {
  title: string;
  layers: Layer[];
  spans: LayerSpan[];
  caption: string;
}

/** Something on Marco's desk right now. */
export interface NowItem {
  /** Kebab-case and unique: the element id is `now-${id}`. */
  id: string;
  /** What kind of now it is, on label tape, e.g. "Building". */
  status: string;
  /** A short name for the section's jump bar, e.g. "Home cluster". */
  short: string;
  title: string;
  story: string[];
  photo?: Photo;
  links?: ProjectLink[];
  more?: SectionLink;
  projects?: NowProject[];
  diagram?: LayerDiagram;
}

/** RAM: what Marco is working on right now, plus the skills he has. */
export interface MemorySection {
  kind: "memory";
  intro: string;
  now: NowItem[];
  skillGroups: SkillGroup[];
  placeholder: boolean;
}

/** A drive in the archive: one category of projects. */
export interface Drive {
  id: string;
  label: string;
  /** A line on what the drive holds. */
  blurb: string;
  category: ProjectCategory;
}

/** SSD: the big projects first, then what's being built, then every project by drive. */
export interface ArchiveSection {
  kind: "archive";
  intro: string;
  /** Slugs of the projects shown first, in full. */
  highlights: string[];
  /** Slug of the project being built right now. */
  building: string;
  drives: Drive[];
  placeholder: boolean;
}

export interface ContactLink {
  label: string;
  href: string;
  /** The handle as people would type it, e.g. "github.com/maroc-dev". */
  detail: string;
  /** What it's good for, in a few words. */
  note: string;
}

/** I/O: how to reach Marco. Never includes his phone number. */
export interface ContactSection {
  kind: "contact";
  intro: string[];
  email: string;
  links: ContactLink[];
  /** How to get the résumé (the PDF has his phone number, so it isn't posted). */
  resume: string;
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
  /** Under the diagram: what was simplified, and why. Sections may supply their own default. */
  caption?: string;
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

/** A measured result, e.g. "22,807" training steps per second. */
export interface Stat {
  value: string;
  label: string;
}

/** A systems project, shown in full: what it does, what it shows, and how it's put together. */
export interface SystemsProject {
  /** Kebab-case and unique: the element id is `systems-${id}`. */
  id: string;
  name: string;
  /** A short name for the section's jump bar. */
  short: string;
  /** Where it's from, on label tape, e.g. "Rutgers CS 417". */
  tag: string;
  summary: string;
  /** What it does. */
  built: string[];
  /** Heading for `built`, when "What it does" doesn't fit, e.g. for work in progress. */
  builtTitle?: string;
  /** What it shows about building systems. */
  shows: string[];
  /** Heading for `shows`, when "What it shows" doesn't fit, e.g. for work in progress. */
  showsTitle?: string;
  stats?: Stat[];
  stack: string[];
  architecture?: Architecture;
  sample?: SystemsSample;
  photo?: Photo;
  links: ProjectLink[];
  more?: SectionLink;
}

/** Worked examples a systems project can show. Each is made-up data, drawn by the UI. */
export type SystemsSample = "ot-example";

/** Server: software architecture and systems that scale. */
export interface SystemsSection {
  kind: "systems";
  intro: string[];
  projects: SystemsProject[];
  placeholder: boolean;
}

export type Section =
  | AboutSection
  | AiSection
  | ProjectsSection
  | MemorySection
  | ArchiveSection
  | ContactSection
  | SystemsSection;

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
