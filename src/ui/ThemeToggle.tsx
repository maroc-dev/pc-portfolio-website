"use client";

import { experienceStore, useExperience } from "@/state/experience-store";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor" />
    </svg>
  );
}

/** The DOM twin of the light switch on the wall. */
export function ThemeToggle() {
  const night = useExperience((s) => s.theme === "night");
  return (
    <button
      type="button"
      onClick={() => experienceStore.getState().toggleTheme()}
      aria-label={night ? "Switch to day: open the blinds" : "Switch to night: turn on the lamp"}
      className="border-line bg-panel/70 text-muted hover:text-fg flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm backdrop-blur-sm transition-colors"
    >
      {night ? <SunIcon /> : <MoonIcon />}
      <span>{night ? "Day" : "Night"}</span>
    </button>
  );
}
