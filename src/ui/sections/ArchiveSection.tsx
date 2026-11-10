"use client";

import { useId, useState } from "react";
import { projectAnchor } from "@/content/parts";
import { getProjects, projects } from "@/content/projects";
import type { ArchiveSection as Archive } from "@/content/types";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { JumpBar } from "./JumpBar";
import { ProjectBlock } from "./projects/ProjectBlock";
import { SubHeading } from "./SubHeading";

function jumpTo(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

/**
 * SSD: a quick overview of the headline projects (each one a jump to its write-up), then each of
 * them in full, then every other project sorted into drives, browsed with tabs labelled like the
 * drives themselves.
 */
export function ArchiveSection({ section }: { section: Archive }) {
  const [active, setActive] = useState(section.drives[0]?.id);
  const baseId = useId();
  const drive = section.drives.find((d) => d.id === active) ?? section.drives[0];
  const featured = section.highlights;
  const headline = getProjects(section.highlights);
  const contents = [
    ...headline.map((p) => ({ id: projectAnchor(p.slug), label: p.title })),
    { id: "archive-drives", label: "All projects" },
  ];
  const onDrive = drive
    ? projects.filter((p) => p.category === drive.category && !featured.includes(p.slug))
    : [];

  return (
    <div>
      <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed">{section.intro}</p>

      <ul aria-label="Highlights at a glance" className="mt-7 grid gap-3 @2xl:grid-cols-3">
        {headline.map((project) => (
          <li key={project.slug} className="flex">
            <button
              type="button"
              onClick={() => jumpTo(projectAnchor(project.slug))}
              className="group border-line bg-base hover:border-powder flex h-full w-full flex-col items-start rounded-md border p-4 text-left transition-colors"
            >
              <span className="type-label text-lg">{project.title}</span>
              <span className="text-muted mt-1.5 text-sm leading-snug">{project.summary}</span>
              <span className="text-accent mt-auto pt-3 text-sm font-semibold underline decoration-2 underline-offset-4">
                Jump to {project.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <JumpBar label="Project Archives" items={contents} className="mt-8" />

      <section
        id="archive-highlights"
        aria-labelledby="archive-highlights-title"
        className="mt-9 scroll-mt-20"
      >
        <SubHeading id="archive-highlights-title">Highlights</SubHeading>
        {headline.map((project) => (
          <ProjectBlock
            key={project.slug}
            project={project}
            size="large"
            active={project.slug === section.building}
          />
        ))}
      </section>

      <section
        id="archive-drives"
        aria-labelledby="archive-drives-title"
        className="border-line mt-4 scroll-mt-20 border-t pt-9"
      >
        <SubHeading id="archive-drives-title">All projects</SubHeading>
        <div
          role="tablist"
          aria-label="Drives"
          onKeyDown={(e) => {
            // Arrow keys move between drives, as in any tab list.
            const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
            const ids = section.drives.map((d) => d.id);
            const at = ids.indexOf(drive?.id ?? "");
            let next: number | undefined;
            if (step) next = (at + step + ids.length) % ids.length;
            else if (e.key === "Home") next = 0;
            else if (e.key === "End") next = ids.length - 1;
            if (next === undefined) return;
            e.preventDefault();
            setActive(ids[next]);
            document.getElementById(`${baseId}-tab-${ids[next]}`)?.focus();
          }}
          className="mt-5 flex flex-wrap gap-2.5"
        >
          {section.drives.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${d.id}`}
              aria-selected={d.id === drive?.id}
              tabIndex={d.id === drive?.id ? 0 : -1}
              aria-controls={`${baseId}-panel`}
              onClick={() => setActive(d.id)}
              className={`tape text-sm transition-[transform,background-color] duration-150 ${
                d.id === drive?.id ? "" : "tape-paper hover:bg-tape hover:-rotate-1"
              }`}
            >
              {d.id}: {d.label}
            </button>
          ))}
        </div>
        {drive && (
          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${drive.id}`}
            className="mt-5"
          >
            <p className="text-muted max-w-[62ch]">{drive.blurb}</p>
            {onDrive.map((project) => (
              <ProjectBlock key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
