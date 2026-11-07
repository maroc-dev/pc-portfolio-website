import Link from "next/link";
import type { Project, ProjectKind } from "@/content/types";
import { DraftNote } from "./sections/DraftNote";

const KIND_LABEL: Record<ProjectKind, string> = {
  personal: "Personal project",
  academic: "Academic project",
  professional: "Professional work",
  research: "Research",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="text-fg/90 mt-3 leading-relaxed">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="marker:text-accent list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** A full project case study. Sections appear only when Marco has written them. */
export function CaseStudy({ project }: { project: Project }) {
  const hasDetail =
    project.problem ||
    project.role ||
    project.architecture ||
    project.challenges?.length ||
    project.outcomes?.length;

  return (
    <article className="mx-auto max-w-[68ch] px-5 py-10 md:py-16">
      <Link
        href="/?part=ssd"
        className="text-muted hover:text-fg text-sm underline-offset-4 hover:underline"
      >
        Back to the machine
      </Link>
      <p className="text-muted mt-10 text-sm">{KIND_LABEL[project.kind]}</p>
      <h1 className="mt-1 text-4xl font-extrabold md:text-5xl">{project.title}</h1>
      <p className="text-fg/90 mt-4 text-lg">{project.summary}</p>

      <ul aria-label="Built with" className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li key={tech} className="border-line text-muted rounded-full border px-3 py-1 text-sm">
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="mt-10">{project.placeholder && <DraftNote />}</div>
      {!hasDetail && (
        <p className="text-muted">
          The full write-up is on its way: the problem, how it&apos;s built, what was hard and what
          came out of it.
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
    </article>
  );
}
