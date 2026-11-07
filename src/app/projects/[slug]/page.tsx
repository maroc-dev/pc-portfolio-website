import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProject, projects } from "@/content/projects";
import { CaseStudy } from "@/ui/CaseStudy";

type Params = PageProps<"/projects/[slug]">["params"];

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: `${project.title} — Marco Ferreira`, description: project.summary };
}

async function ProjectContent({ params }: { params: Params }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <CaseStudy project={project} />;
}

/** Every slug is prerendered; the fallback only shows during a client navigation. */
export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <main>
      <Suspense fallback={<p className="text-muted mx-auto max-w-[68ch] px-5 py-16">Opening…</p>}>
        <ProjectContent params={params} />
      </Suspense>
    </main>
  );
}
