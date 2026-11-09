"use client";

import { useId, useState } from "react";
import { getProject, getProjects, projects } from "@/content/projects";
import type { ArchiveSection as Archive } from "@/content/types";
import { JumpBar } from "./JumpBar";
import { ProjectBlock } from "./projects/ProjectBlock";
import { SubHeading } from "./SubHeading";

const PARTS = [
  { id: "archive-highlights", label: "Highlights" },
  { id: "archive-building", label: "Building now" },
  { id: "archive-drives", label: "All projects" },
];

/**
 * SSD: the two big projects in full, then the one being built, then every other project sorted
 * into drives, browsed with tabs labelled like the drives themselves.
 */
export function ArchiveSection({ section }: { section: Archive }) {
  const [active, setActive] = useState(section.drives[0]?.id);
  const baseId = useId();
  const drive = section.drives.find((d) => d.id === active) ?? section.drives[0];
  const featured = [...section.highlights, section.building];
  const building = getProject(section.building);
  const onDrive = drive
    ? projects.filter((p) => p.category === drive.category && !featured.includes(p.slug))
    : [];

  return (
    <div>
      <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed">{section.intro}</p>
      <JumpBar label="Project Archives" items={PARTS} className="mt-8" />

      <section
        id="archive-highlights"
        aria-labelledby="archive-highlights-title"
        className="mt-9 scroll-mt-20"
      >
        <SubHeading id="archive-highlights-title">Highlights</SubHeading>
        {getProjects(section.highlights).map((project) => (
          <ProjectBlock key={project.slug} project={project} size="large" />
        ))}
      </section>

      {building && (
        <section
          id="archive-building"
          aria-labelledby="archive-building-title"
          className="border-line mt-4 scroll-mt-20 border-t pt-9"
        >
          <SubHeading id="archive-building-title">Building now</SubHeading>
          <ProjectBlock project={building} size="large" active />
        </section>
      )}

      <section
        id="archive-drives"
        aria-labelledby="archive-drives-title"
        className="border-line mt-4 scroll-mt-20 border-t pt-9"
      >
        <SubHeading id="archive-drives-title">All projects</SubHeading>
        <div role="tablist" aria-label="Drives" className="mt-5 flex flex-wrap gap-2.5">
          {section.drives.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${d.id}`}
              aria-selected={d.id === drive?.id}
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
