"use client";

import { experienceStore, useExperience } from "@/state/experience-store";

/**
 * The DOM twin of the light switch on the wall: a small wall plate whose rocker flips up for
 * day and down for night. The text says what pressing it will do.
 */
export function ThemeToggle() {
  const night = useExperience((s) => s.theme === "night");
  return (
    <button
      type="button"
      onClick={() => experienceStore.getState().toggleTheme()}
      aria-label={night ? "Switch to day: open the blinds" : "Switch to night: turn on the lamp"}
      className="group text-muted hover:text-fg flex items-center gap-2.5 text-sm transition-colors"
    >
      <span
        aria-hidden="true"
        className="border-line bg-panel relative block h-8 w-[22px] rounded-[4px] border shadow-[0_1px_2px_rgb(19_35_74/0.15)]"
      >
        <span
          className={`border-line absolute inset-x-[5px] h-[13px] rounded-[2px] border transition-[top,background-color] duration-200 ${
            night ? "bg-powder top-[14px]" : "bg-tape top-[3px]"
          }`}
        />
      </span>
      <span className="type-meta">{night ? "Day" : "Night"}</span>
    </button>
  );
}
