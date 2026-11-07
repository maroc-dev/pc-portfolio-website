"use client";

import { useId, useState } from "react";
import { projects } from "@/content/projects";
import type { ArchiveSection as Archive } from "@/content/types";
import { ProjectList } from "./ProjectList";

/** SSD: projects sorted into drives, browsed with tabs. */
export function ArchiveSection({ section }: { section: Archive }) {
  const [active, setActive] = useState(section.drives[0]?.id);
  const baseId = useId();
  const drive = section.drives.find((d) => d.id === active) ?? section.drives[0];

  return (
    <>
      <p className="text-fg/90 max-w-[62ch]">{section.intro}</p>
      <div role="tablist" aria-label="Drives" className="mt-5 flex flex-wrap gap-2">
        {section.drives.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${d.id}`}
            aria-selected={d.id === drive?.id}
            aria-controls={`${baseId}-panel`}
            onClick={() => setActive(d.id)}
            className="border-line text-muted hover:text-fg aria-selected:border-accent/70 aria-selected:text-fg rounded-lg border px-3 py-1.5 text-sm transition-colors"
          >
            <span className="text-accent type-mono mr-1.5">{d.id}:</span>
            {d.label}
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
