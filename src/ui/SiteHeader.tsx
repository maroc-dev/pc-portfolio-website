"use client";

import type { PartId } from "@/content/types";
import { profile } from "@/content/profile";
import { experienceStore, useExperience } from "@/state/experience-store";
import { ThemeToggle } from "./ThemeToggle";

/** Plain-language shortcuts for visitors who just want the essentials. */
const NAV: { label: string; part: PartId }[] = [
  { label: "About", part: "cpu" },
  { label: "Projects", part: "ssd" },
  { label: "Skills", part: "ram" },
  { label: "Contact", part: "io" },
];

export function SiteHeader() {
  const selected = useExperience((s) => s.selected);
  const fullView = useExperience((s) => s.fullView);
  // The greeting is real text, so it's there before (and without) the 3D monitor that also says
  // it. It reads in full ink while the desk sets up, then steps back once the scene takes over.
  const settled = useExperience((s) => s.phase !== "boot");
  return (
    <header
      className={`pointer-events-none relative z-30 flex items-start justify-between gap-4 px-4 py-4 transition-[opacity,visibility] duration-500 md:absolute md:inset-x-0 md:top-0 md:px-8 md:py-6 ${
        fullView ? "invisible opacity-0" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => experienceStore.getState().back()}
        className="pointer-events-auto text-left"
      >
        <span className="type-display block text-[1.375rem] whitespace-nowrap md:text-[1.625rem]">
          {profile.name}
        </span>
        <span
          className={`mt-1 block max-w-[30ch] text-sm leading-snug transition-colors duration-700 ${
            settled ? "text-muted" : "text-fg"
          }`}
        >
          {profile.greeting}
        </span>
      </button>
      <div className="pointer-events-auto flex items-center gap-5">
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1 text-[0.9375rem]">
            {NAV.map(({ label, part }) => {
              const current = selected === part;
              return (
                <li key={part}>
                  <button
                    type="button"
                    aria-current={current ? "true" : undefined}
                    onClick={() => experienceStore.getState().select(part)}
                    className={
                      current
                        ? "tape mx-1.5 text-[0.875rem]"
                        : "text-muted hover:text-fg px-2.5 py-1 transition-colors"
                    }
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
