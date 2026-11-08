import { systemsAnchor } from "@/content/parts";
import type { SystemsProject, SystemsSection as Systems } from "@/content/types";
import { ArchDiagram } from "../ArchDiagram";
import { JumpBar } from "../JumpBar";
import { PhotoFrame } from "../PhotoFrame";
import { SectionLinkButton } from "../SectionLinkButton";
import { OtExample } from "./OtExample";

/** A point that opens with a short name, e.g. "Rooms: each document…", gets that name in bold. */
const LEAD = /^([^:.]{2,32}): /;

const CAPTION = "Simplified to the main pieces and how they talk to each other.";

function Points({ title, points }: { title: string; points: string[] }) {
  return (
    <div>
      <h4 className="type-label text-[0.9375rem]">{title}</h4>
      <ul className="mt-3 max-w-[70ch] space-y-2.5">
        {points.map((point) => {
          const lead = LEAD.exec(point);
          return (
            <li key={point} className="relative pl-5 leading-relaxed">
              <span
                aria-hidden="true"
                className="bg-powder absolute top-[0.72em] left-0 h-[3px] w-2.5 rounded-full"
              />
              {lead ? (
                <>
                  <strong className="font-semibold">{lead[1]}:</strong>{" "}
                  {point.slice(lead[0].length)}
                </>
              ) : (
                point
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

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

      {project.stats && (
        <ul className="mt-7 grid gap-4 @xl:grid-cols-2">
          {project.stats.map((stat) => (
            <li key={stat.label} className="border-tape flex items-center gap-4 border-l-4 pl-4">
              <span className="type-display text-[2.5rem] leading-none">{stat.value}</span>
              <span className="text-muted text-sm leading-snug">{stat.label}</span>
            </li>
          ))}
        </ul>
      )}

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
          caption={project.architecture.caption ?? CAPTION}
        />
      )}

      <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="type-meta text-muted text-sm">Built with</span>
        <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
          {project.stack.map((tech) => (
            <li key={tech} className="bg-base rounded-[3px] px-2 py-0.5 text-[0.9375rem]">
              {tech}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold underline decoration-2 underline-offset-4"
          >
            {link.label}
          </a>
        ))}
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
