"use client";

import { useId, useState } from "react";
import { projects } from "@/content/projects";
import type { ArchiveSection as Archive } from "@/content/types";
import { ProjectList } from "./ProjectList";

/** SSD: projects sorted into drives, browsed with tabs labelled like the drives themselves. */
export function ArchiveSection({ section }: { section: Archive }) {
  const [active, setActive] = useState(section.drives[0]?.id);
  const baseId = useId();
  const drive = section.drives.find((d) => d.id === active) ?? section.drives[0];

  return (
    <>
      <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed">{section.intro}</p>
      <div role="tablist" aria-label="Drives" className="mt-6 flex flex-wrap gap-2.5">
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
          <ProjectList projects={projects.filter((p) => p.category === drive.category)} />
        </div>
      )}
    </>
  );
}
