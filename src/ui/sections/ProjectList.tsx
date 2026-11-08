import Link from "next/link";
import type { Project } from "@/content/types";

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="text-muted">Nothing on this drive yet.</p>;
  }
  return (
    <ul className="divide-line border-line divide-y border-y">
      {projects.map((project) => (
        <li key={project.slug}>
          <article className="py-5">
            <h3 className="type-label text-xl">{project.title}</h3>
            <p className="mt-1.5 max-w-[62ch] leading-relaxed">{project.summary}</p>
            <ul
              aria-label="Built with"
              className="type-meta text-muted mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1 text-sm"
            >
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                prefetch
                href={`/projects/${project.slug}`}
                className="text-accent font-semibold underline decoration-2 underline-offset-4"
              >
                Read the case study
              </Link>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-fg underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
