"use client";

import { useExperience } from "@/state/experience-store";

/**
 * The opening's first frame as a picture, so the page looks finished from the very first paint
 * while the scene prepares. The canvas then fades in over an identical image. Background images
 * rather than <img>, so only the one matching the theme and screen shape is downloaded.
 * Captured by `scripts/capture-stills.mjs`. Reduced motion skips the opening, so it skips this.
 */
export function LoadingStill() {
  const opening = useExperience((s) => s.phase === "boot" && s.selected === null);
  return (
    <div
      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 motion-reduce:hidden ${
        opening ? "opacity-100" : "opacity-0 delay-700"
      } night:bg-[url(/stills/intro-night-wide.jpg)] night:portrait:bg-[url(/stills/intro-night-tall.jpg)] bg-[url(/stills/intro-day-wide.jpg)] portrait:bg-[url(/stills/intro-day-tall.jpg)]`}
    />
  );
}
