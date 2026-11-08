"use client";

import { parts } from "@/content/parts";
import type { PartId } from "@/content/types";
import { experienceStore, useExperience } from "@/state/experience-store";

function leave(id: PartId) {
  if (experienceStore.getState().hovered === id) experienceStore.getState().hover(null);
}

/**
 * Every part as a real button: the keyboard, screen-reader and touch route into the machine.
 * Each one carries the part's label tape; hovering or focusing it lights the part in the scene.
 * Hidden in full view, where the monitor fills the screen.
 */
export function PartDock() {
  const selected = useExperience((s) => s.selected);
  const fullView = useExperience((s) => s.fullView);
  return (
    <nav
      aria-label="Parts of the machine"
      className={`relative z-20 px-4 pb-6 transition-[opacity,visibility] duration-300 md:pointer-events-none md:absolute md:inset-x-0 md:bottom-0 md:flex md:justify-center md:pb-6 ${
        fullView ? "invisible opacity-0" : ""
      }`}
    >
      <p className="text-muted mb-3 text-sm md:hidden">Tap a part to look inside.</p>
      <ul className="md:border-line md:bg-panel grid grid-cols-3 gap-2 md:pointer-events-auto md:flex md:gap-0 md:rounded-[10px] md:border md:px-2 md:py-1.5 md:shadow-[0_10px_30px_-12px_rgb(19_35_74/0.35)]">
        {parts.map((part) => {
          const pressed = selected === part.id;
          return (
            <li key={part.id}>
              <button
                type="button"
                aria-pressed={pressed}
                title={part.blurb}
                onClick={() => experienceStore.getState().select(part.id)}
                onPointerEnter={() => experienceStore.getState().hover(part.id)}
                onPointerLeave={() => leave(part.id)}
                onFocus={() => experienceStore.getState().hover(part.id)}
                onBlur={() => leave(part.id)}
                className="group border-line bg-panel flex w-full flex-col items-start gap-1.5 rounded-lg border px-3 py-2.5 text-left md:min-w-[7.5rem] md:border-0 md:bg-transparent md:px-3.5"
              >
                <span
                  className={`tape text-xs transition-[transform,background-color] duration-150 group-hover:-rotate-2 group-focus-visible:-rotate-2 ${
                    pressed ? "" : "tape-paper group-hover:bg-tape group-focus-visible:bg-tape"
                  }`}
                >
                  {part.label}
                </span>
                <span
                  className={`text-sm ${pressed ? "text-fg font-semibold" : "text-muted group-hover:text-fg"}`}
                >
                  {part.topic}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
