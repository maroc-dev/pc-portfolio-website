import Link from "next/link";
import { parts } from "@/content/parts";
import { projects } from "@/content/projects";
import { ExperienceShell } from "./_components/ExperienceShell";

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">Marco Ferreira — explore the machine</h1>
      <ExperienceShell />
      {/* Without JavaScript the machine can't run, so offer a plain index instead. */}
      <noscript>
        <section className="mx-auto max-w-[68ch] px-5 py-10">
          <h2 className="text-2xl font-bold">What&apos;s inside</h2>
          <ul className="mt-4 space-y-2">
            {parts.map((part) => (
              <li key={part.id}>
                <strong>{part.heading}</strong>: {part.blurb}
              </li>
            ))}
          </ul>
          <h2 className="mt-8 text-2xl font-bold">Projects</h2>
          <ul className="mt-4 space-y-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="text-amber">
                  {project.title}
                </Link>
                : {project.summary}
              </li>
            ))}
          </ul>
        </section>
      </noscript>
    </main>
  );
}
