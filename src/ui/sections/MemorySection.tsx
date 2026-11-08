import { nowAnchor } from "@/content/parts";
import type { MemorySection as Memory, NowItem, ProjectLink, Skill } from "@/content/types";
import { LayerStack } from "./memory/LayerStack";
import { PhotoFrame } from "./PhotoFrame";
import { SectionLinkButton } from "./SectionLinkButton";
import { SubHeading } from "./SubHeading";

function ExternalLinks({ links, className = "" }: { links: ProjectLink[]; className?: string }) {
  return (
    <p className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {links.map((link) => (
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
    </p>
  );
}

function NowEntry({ item }: { item: NowItem }) {
  const titleId = `${nowAnchor(item.id)}-title`;
  return (
    <article
      id={nowAnchor(item.id)}
      aria-labelledby={titleId}
      className="border-line scroll-mt-4 border-t py-9 first-of-type:border-t-0 first-of-type:pt-6"
    >
      <div
        className={item.photo ? "@3xl:grid @3xl:grid-cols-[minmax(0,1fr)_15rem] @3xl:gap-10" : ""}
      >
        <div>
          <span className="tape tape-paper text-xs">{item.status}</span>
          <h4 id={titleId} className="type-display mt-3 text-[1.625rem] @2xl:text-[1.875rem]">
            {item.title}
          </h4>
          <div className="mt-3 max-w-[60ch] space-y-3 text-[1.0625rem] leading-relaxed">
            {item.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {item.links && <ExternalLinks links={item.links} className="mt-4" />}
          {item.more && <SectionLinkButton link={item.more} className="mt-4" />}
        </div>
        {item.photo && (
          <PhotoFrame
            photo={item.photo}
            sizes="(min-width: 768px) 300px, 80vw"
            className="mt-7 max-w-72 @3xl:mt-2"
          />
        )}
      </div>

      {item.projects && (
        <ul className="mt-8 grid gap-x-10 gap-y-8 @xl:grid-cols-2">
          {item.projects.map((project) => (
            <li key={project.name} className="border-powder border-t-[3px] pt-4">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="type-label text-lg">{project.name}</span>
                <span className="type-meta text-muted text-sm">{project.status}</span>
              </p>
              <div className="text-muted mt-2 space-y-2.5 leading-relaxed">
                {project.detail.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <ExternalLinks links={project.links} className="mt-3.5 text-sm" />
            </li>
          ))}
        </ul>
      )}

      {item.diagram && <LayerStack diagram={item.diagram} />}
    </article>
  );
}

function SkillChip({ skill }: { skill: Skill }) {
  if (skill.tier === "learning") {
    return (
      <li className="border-muted rounded-[3px] border border-dashed px-2 py-px text-[0.9375rem]">
        {skill.name}
        <span className="sr-only">, learning now</span>
      </li>
    );
  }
  return (
    <li className="bg-base inline-flex items-center gap-1.5 rounded-[3px] px-2 py-0.5 text-[0.9375rem]">
      {skill.tier === "professional" && (
        <span aria-hidden="true" className="bg-accent size-1.5 shrink-0 rounded-full" />
      )}
      {skill.name}
      {skill.tier === "professional" && <span className="sr-only">, used at work</span>}
    </li>
  );
}

/** RAM: what's loaded right now, then the skills already on board. */
export function MemorySection({ section }: { section: Memory }) {
  return (
    <>
      <p className="max-w-[60ch] text-[1.0625rem] leading-relaxed">{section.intro}</p>

      <section id="memory-now" aria-labelledby="memory-now-title" className="mt-9 scroll-mt-4">
        <SubHeading id="memory-now-title">Right now</SubHeading>
        {section.now.map((item) => (
          <NowEntry key={item.id} item={item} />
        ))}
      </section>

      <section
        id="memory-skills"
        aria-labelledby="memory-skills-title"
        className="mt-8 scroll-mt-4"
      >
        <SubHeading id="memory-skills-title">Skills</SubHeading>
        <p aria-hidden="true" className="text-muted mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="bg-accent size-1.5 rounded-full" />
            Used at work
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="border-muted h-3.5 w-5 rounded-[3px] border border-dashed" />
            Learning now
          </span>
        </p>
        <div className="divide-line border-line mt-4 divide-y border-y">
          {section.skillGroups.map((group) => (
            <section
              key={group.title}
              aria-label={group.title}
              className="grid gap-2 py-3.5 @xl:grid-cols-[11rem_1fr] @xl:gap-6"
            >
              <h4 className="type-meta text-muted pt-0.5 text-sm">{group.title}</h4>
              <ul className="flex flex-wrap gap-x-1.5 gap-y-2">
                {group.skills.map((skill) => (
                  <SkillChip key={skill.name} skill={skill} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
