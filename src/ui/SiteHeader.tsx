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
  return (
    <header className="pointer-events-none relative z-30 flex items-center justify-between gap-4 px-4 py-4 md:absolute md:inset-x-0 md:top-0 md:px-8 md:py-6">
      <button
        type="button"
        onClick={() => experienceStore.getState().back()}
        className="pointer-events-auto text-left"
      >
        <span className="type-casual block text-lg leading-tight font-bold whitespace-nowrap">
          {profile.name}
        </span>
        <span className="text-muted block text-sm">Software engineer</span>
      </button>
      <div className="pointer-events-auto flex items-center gap-3">
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {NAV.map(({ label, part }) => (
              <li key={part}>
                <button
                  type="button"
                  aria-current={selected === part ? "true" : undefined}
                  onClick={() => experienceStore.getState().select(part)}
                  className="text-muted hover:text-fg aria-[current=true]:text-accent rounded-full px-3 py-1.5 transition-colors"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
