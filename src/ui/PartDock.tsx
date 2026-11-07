"use client";

import { parts } from "@/content/parts";
import type { PartId } from "@/content/types";
import { experienceStore, useExperience } from "@/state/experience-store";

function leave(id: PartId) {
  if (experienceStore.getState().hovered === id) experienceStore.getState().hover(null);
}

/**
 * Every part as a real button: the keyboard, screen-reader and touch route into the machine.
 * Hovering or focusing a button lights the matching part in the scene.
 */
export function PartDock() {
  const selected = useExperience((s) => s.selected);
  return (
    <nav
      aria-label="Parts of the machine"
      className="relative z-20 px-4 pb-6 md:pointer-events-none md:absolute md:inset-x-0 md:bottom-0 md:flex md:justify-center md:pb-6"
    >
      <p className="text-muted mb-3 text-sm md:hidden">Tap a part to look inside.</p>
      <ul className="md:border-line md:bg-base/75 grid grid-cols-3 gap-2 md:pointer-events-auto md:flex md:gap-1 md:rounded-2xl md:border md:p-1.5 md:backdrop-blur-md">
        {parts.map((part) => (
          <li key={part.id}>
            <button
              type="button"
              aria-pressed={selected === part.id}
              title={part.blurb}
              onClick={() => experienceStore.getState().select(part.id)}
              onPointerEnter={() => experienceStore.getState().hover(part.id)}
              onPointerLeave={() => leave(part.id)}
              onFocus={() => experienceStore.getState().hover(part.id)}
              onBlur={() => leave(part.id)}
              className="group border-line bg-panel/60 hover:border-accent/50 hover:bg-panel aria-pressed:border-accent/70 aria-pressed:bg-panel flex w-full flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors md:min-w-28 md:border-transparent md:bg-transparent"
            >
              <span className="text-muted type-mono group-aria-pressed:text-accent text-xs">
                {part.label}
              </span>
              <span className="text-fg text-sm">{part.topic}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
