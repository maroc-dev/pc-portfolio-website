import Link from "next/link";
import { projectAnchor } from "@/content/parts";
import type { Project } from "@/content/types";
import { ArchDiagram } from "../ArchDiagram";
import { BuiltWith, DIAGRAM_CAPTION, ExternalLinks, Points, Stats } from "../ProjectParts";
import { SectionLinkButton } from "../SectionLinkButton";
import { ProjectVisuals } from "./ProjectVisuals";

/**
 * One project in full: what it is, how it works, a diagram, the stack and its links. Highlights
 * use the large size; projects on a drive use the regular one.
 */
export function ProjectBlock({
  project,
  size = "regular",
  active = false,
}: {
  project: Project;
  size?: "large" | "regular";
  /** Being built right now: its tag wears yellow tape. */
  active?: boolean;
}) {
  const titleId = `${projectAnchor(project.slug)}-title`;
  const large = size === "large";
  return (
    <article
      id={projectAnchor(project.slug)}
      aria-labelledby={titleId}
      className={`border-line scroll-mt-20 border-t first-of-type:border-t-0 ${
        large ? "py-11 first-of-type:pt-7" : "py-9 first-of-type:pt-6"
      }`}
    >
      <span className={`tape text-xs ${active ? "" : "tape-paper"}`}>{project.tag}</span>
      <h4
        id={titleId}
        className={`type-display mt-3 ${
          large ? "text-[1.75rem] @2xl:text-[2.125rem]" : "text-[1.375rem] @2xl:text-[1.5rem]"
        }`}
      >
        {project.title}
      </h4>
      <p
        className={`mt-2.5 max-w-[62ch] leading-relaxed ${large ? "text-[1.125rem]" : "text-[1.0625rem]"}`}
      >
        {project.summary}
      </p>

      {project.stats && <Stats stats={project.stats} className="mt-6" />}

      <div className="text-muted mt-5 max-w-[66ch] space-y-3 leading-relaxed">
        {project.details.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {project.highlights && (
        <div className="mt-6">
          <Points title="Highlights" points={project.highlights} level={5} />
        </div>
      )}

      {project.diagram && (
        <ArchDiagram
          architecture={project.diagram}
          name={project.title}
          caption={project.diagram.caption ?? DIAGRAM_CAPTION}
        />
      )}

      {project.visuals && (
        <section aria-labelledby={`${projectAnchor(project.slug)}-work`} className="mt-9">
          <h5 id={`${projectAnchor(project.slug)}-work`} className="type-display text-[1.25rem]">
            See it work
          </h5>
          <div className="mt-4">
            <ProjectVisuals visuals={project.visuals} level={6} />
          </div>
        </section>
      )}

      <BuiltWith stack={project.stack} className="mt-7" />

      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <ExternalLinks links={project.links} />
        <Link
          href={`/projects/${project.slug}`}
          className="text-muted hover:text-fg underline underline-offset-4"
        >
          Open as a page
        </Link>
        {project.more && <SectionLinkButton link={project.more} />}
      </div>
    </article>
  );
}
