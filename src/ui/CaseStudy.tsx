import Link from "next/link";
import { getPart } from "@/content/parts";
import { profile } from "@/content/profile";
import type { Project } from "@/content/types";
import { ArchDiagram } from "./sections/ArchDiagram";
import { DraftNote } from "./sections/DraftNote";
import { DIAGRAM_CAPTION, ExternalLinks, Points, Stats } from "./sections/ProjectParts";
import { ProjectVisuals } from "./sections/projects/ProjectVisuals";

/**
 * A project on its own page, laid out like a spec sheet: the title block on top, the write-up
 * and diagram on the left, and the stack and links beside it.
 */
export function CaseStudy({ project }: { project: Project }) {
  const more = project.more && getPart(project.more.part);
  return (
    <div className="@container mx-auto max-w-[72rem] px-4 py-6 md:px-8 md:py-10">
      <nav className="flex items-baseline justify-between gap-4">
        <Link href="/" className="type-display text-lg">
          {profile.name}
        </Link>
        <Link
          href="/?part=ssd"
          className="text-muted hover:text-fg text-sm underline-offset-4 hover:underline"
        >
          Back to the machine
        </Link>
      </nav>

      <article className="border-line bg-panel @container mt-6 rounded-xl border px-5 py-8 shadow-[0_18px_40px_-28px_rgb(19_35_74/0.5)] md:mt-8 md:px-12 md:py-12">
        <header className="max-w-[48rem]">
          <span className="tape text-xs">{project.tag}</span>
          <h1 className="type-display mt-5 text-[2.5rem] md:text-[3.75rem]">{project.title}</h1>
          <p className="text-muted mt-4 text-xl leading-snug">{project.summary}</p>
        </header>

        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-14">
          <aside className="space-y-6 md:order-2">
            <div>
              <h2 className="type-meta text-muted text-sm">Built with</h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech} className="bg-base rounded-[3px] px-2 py-0.5 text-[0.9375rem]">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="type-meta text-muted text-sm">Links</h2>
              <div className="mt-2 flex flex-col items-start gap-1.5">
                <ExternalLinks links={project.links} />
                {project.more && more && (
                  <Link
                    href={`/?part=${more.id}`}
                    className="text-muted hover:text-fg underline underline-offset-4"
                  >
                    More in {more.topic}
                  </Link>
                )}
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-8 md:order-1">
            {project.placeholder && <DraftNote />}
            {project.stats && <Stats stats={project.stats} />}
            <div className="max-w-[68ch] space-y-4 text-[1.0625rem] leading-relaxed">
              {project.details.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {project.highlights && (
              <Points title="Highlights" points={project.highlights} level={2} />
            )}
          </div>
        </div>

        {project.diagram && (
          <ArchDiagram
            architecture={project.diagram}
            name={project.title}
            caption={project.diagram.caption ?? DIAGRAM_CAPTION}
          />
        )}

        {project.visuals && (
          <section aria-labelledby="see-it-work" className="mt-12">
            <h2 id="see-it-work" className="type-display text-[1.75rem]">
              See it work
            </h2>
            <div className="mt-5">
              <ProjectVisuals visuals={project.visuals} level={3} />
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
