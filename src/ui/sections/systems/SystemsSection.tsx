import { systemsAnchor } from "@/content/parts";
import type { SystemsProject, SystemsSection as Systems } from "@/content/types";
import { ArchDiagram } from "../ArchDiagram";
import { JumpBar } from "../JumpBar";
import { PhotoFrame } from "../PhotoFrame";
import { BuiltWith, DIAGRAM_CAPTION, ExternalLinks, Points, Stats } from "../ProjectParts";
import { SectionLinkButton } from "../SectionLinkButton";
import { OtExample } from "./OtExample";

function Project({ project }: { project: SystemsProject }) {
  const titleId = `${systemsAnchor(project.id)}-title`;
  return (
    <article
      id={systemsAnchor(project.id)}
      aria-labelledby={titleId}
      className="border-line scroll-mt-20 border-t py-12 first-of-type:border-t-0 first-of-type:pt-9"
    >
      <div
        className={
          project.photo ? "@3xl:grid @3xl:grid-cols-[minmax(0,1fr)_15rem] @3xl:gap-10" : ""
        }
      >
        <div>
          <span className="tape tape-paper text-xs">{project.tag}</span>
          <h3 id={titleId} className="type-display mt-3 text-[1.75rem] @2xl:text-[2.125rem]">
            {project.name}
          </h3>
          <p className="mt-3 max-w-[60ch] text-[1.125rem] leading-relaxed">{project.summary}</p>
        </div>
        {project.photo && (
          <PhotoFrame
            photo={project.photo}
            sizes="(min-width: 768px) 300px, 80vw"
            className="mt-7 max-w-72 @3xl:mt-2"
          />
        )}
      </div>

      {project.stats && <Stats stats={project.stats} className="mt-7" />}

      <div
        className={`mt-8 grid gap-x-10 gap-y-8 ${
          // Side by side only when the two lists are about the same length.
          Math.abs(project.built.length - project.shows.length) < 3 ? "@2xl:grid-cols-2" : ""
        }`}
      >
        <Points title={project.builtTitle ?? "What it does"} points={project.built} />
        <Points title={project.showsTitle ?? "What it shows"} points={project.shows} />
      </div>

      {project.sample === "ot-example" && <OtExample />}

      {project.architecture && (
        <ArchDiagram
          architecture={project.architecture}
          name={project.name}
          caption={project.architecture.caption ?? DIAGRAM_CAPTION}
        />
      )}

      <BuiltWith stack={project.stack} className="mt-7" />

      <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <ExternalLinks links={project.links} />
        {project.more && <SectionLinkButton link={project.more} />}
      </div>
    </article>
  );
}

/** Server: why Marco loves systems work, then the systems he's built, each in full. */
export function SystemsSection({ section }: { section: Systems }) {
  const contents = section.projects.map((p) => ({ id: systemsAnchor(p.id), label: p.short }));
  return (
    <div>
      <div className="max-w-[60ch] space-y-4 text-[1.1875rem] leading-relaxed">
        {section.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <JumpBar label="Connected Systems" items={contents} className="mt-9" />
      {section.projects.map((project) => (
        <Project key={project.id} project={project} />
      ))}
    </div>
  );
}
