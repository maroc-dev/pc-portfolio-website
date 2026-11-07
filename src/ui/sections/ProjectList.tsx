import Link from "next/link";
import type { Project } from "@/content/types";

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="text-dust">Nothing here yet.</p>;
  }
  return (
    <ul className="grid gap-3">
      {projects.map((project) => (
        <li key={project.slug}>
          <article className="border-line bg-night/40 rounded-xl border p-4">
            <h3 className="text-lg font-bold">{project.title}</h3>
            <p className="text-cream/85 mt-1">{project.summary}</p>
            <ul aria-label="Built with" className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="border-line text-dust rounded-full border px-2.5 py-0.5 text-xs"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                prefetch
                href={`/projects/${project.slug}`}
                className="text-amber underline-offset-4 hover:underline"
              >
                Read the case study
              </Link>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dust hover:text-cream underline-offset-4 hover:underline"
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
