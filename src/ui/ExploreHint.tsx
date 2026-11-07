"use client";

import { COMPACT_QUERY, useMediaQuery } from "@/lib/dom/use-media-query";
import { useExperience } from "@/state/experience-store";

/**
 * A gentle nudge above the dock: first "hover over the PC", then, once the parts are outlined,
 * "click one". Disappears while a section is open. Phones have their own hint by the dock.
 */
export function ExploreHint() {
  const compact = useMediaQuery(COMPACT_QUERY);
  const message = useExperience((s) => {
    if (s.phase !== "overview" || s.scene !== "ready") return null;
    if (s.pcHovered && !s.hovered)
      return "Each outlined part opens a section. Click one to look inside.";
    if (!s.explored && !s.pcHovered) return "Hover over the PC to see what's inside.";
    return null;
  });

  if (compact) return null;
  return (
    <p
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-28 z-20 flex justify-center"
    >
      <span
        className="border-line bg-panel/80 text-fg rounded-full border px-4 py-1.5 text-sm shadow-sm backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: message ? 1 : 0 }}
      >
        {message ?? " "}
      </span>
    </p>
  );
}
