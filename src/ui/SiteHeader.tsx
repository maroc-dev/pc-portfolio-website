"use client";

import type { PartId } from "@/content/types";
import { profile } from "@/content/profile";
import { contact } from "@/content/sections/contact";
import { experienceStore, useExperience } from "@/state/experience-store";
import { ThemeToggle } from "./ThemeToggle";

/** Plain-language shortcuts for visitors who just want the essentials. */
const NAV: { label: string; part: PartId }[] = [
  { label: "About", part: "cpu" },
  { label: "AI", part: "gpu" },
  { label: "Projects", part: "ssd" },
  { label: "Systems", part: "server" },
  { label: "Now", part: "ram" },
  { label: "Contact", part: "io" },
];

export function SiteHeader() {
  const selected = useExperience((s) => s.selected);
  const fullView = useExperience((s) => s.fullView);
  // The greeting is real text, so it's there before (and without) the 3D monitor that also says
  // it. It reads in full ink while the desk sets up, then steps back once the scene takes over.
  const settled = useExperience((s) => s.phase !== "boot");
  // On phones an open section's sheet covers the header below the name.
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
          } ${selected ? "max-md:hidden" : ""}`}
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
        <a
          href={contact.resume.href}
          download={contact.resume.href.split("/").pop()}
          aria-label="Download my résumé (PDF)"
          className="tape tape-paper hover:bg-tape flex items-center gap-1.5 text-xs transition-[transform,background-color] duration-150 hover:-rotate-1"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
            <path
              d="M8 2v8M4.5 7 8 10.5 11.5 7M3 13.5h10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Résumé
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
