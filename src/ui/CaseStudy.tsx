import Link from "next/link";
import type { Project, ProjectKind } from "@/content/types";
import { profile } from "@/content/profile";
import { DraftNote } from "./sections/DraftNote";

const KIND_LABEL: Record<ProjectKind, string> = {
  personal: "Personal project",
  academic: "Academic project",
  professional: "Professional work",
  research: "Research",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line border-t pt-6">
      <h2 className="type-label text-[1.3125rem]">{title}</h2>
      <div className="mt-3 text-[1.0625rem] leading-relaxed">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="marker:text-powder list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * A full project case study, laid out like a spec sheet: the title block on top, the write-up on
 * the left and the stack and links beside it. Sections appear only when Marco has written them.
 */
export function CaseStudy({ project }: { project: Project }) {
  const hasDetail =
    project.problem ||
    project.role ||
    project.architecture ||
    project.challenges?.length ||
    project.outcomes?.length;

  return (
    <div className="mx-auto max-w-[72rem] px-4 py-6 md:px-8 md:py-10">
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

      <article className="border-line bg-panel mt-6 rounded-xl border px-5 py-8 shadow-[0_18px_40px_-28px_rgb(19_35_74/0.5)] md:mt-8 md:px-12 md:py-12">
        <header className="max-w-[48rem]">
          <span className="tape text-xs">{KIND_LABEL[project.kind]}</span>
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
            {project.links.length > 0 && (
              <div>
                <h2 className="type-meta text-muted text-sm">Links</h2>
                <ul className="mt-2 space-y-1.5">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent font-semibold underline decoration-2 underline-offset-4"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          <div className="max-w-[68ch] space-y-9 md:order-1">
            {project.placeholder && <DraftNote />}
            {!hasDetail && (
              <p className="text-muted text-[1.0625rem] leading-relaxed">
                The full write-up is on its way: the problem, how it&apos;s built, what was hard and
                what came out of it.
              </p>
            )}
            {project.problem && <Block title="The problem">{project.problem}</Block>}
            {project.role && <Block title="My part">{project.role}</Block>}
            {project.architecture && <Block title="How it's built">{project.architecture}</Block>}
            {project.challenges?.length ? (
              <Block title="What was hard">
                <List items={project.challenges} />
              </Block>
            ) : null}
            {project.solutions?.length ? (
              <Block title="Solutions and tradeoffs">
                <List items={project.solutions} />
              </Block>
            ) : null}
            {project.outcomes?.length ? (
              <Block title="Results">
                <List items={project.outcomes} />
              </Block>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
