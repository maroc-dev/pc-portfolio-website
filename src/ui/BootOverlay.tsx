"use client";

import { useEffect } from "react";
import { experienceStore, useExperience } from "@/state/experience-store";

/** Longest the intro may hold the stage, even if the scene is slow to start. */
const MAX_BOOT_MS = 4000;

/**
 * A quiet "powering on" note while the machine starts. Never blocks: navigation works throughout,
 * and any key, click or the skip button ends it.
 */
export function BootOverlay() {
  const booting = useExperience((s) => s.phase === "boot");

  useEffect(() => {
    if (!booting) return;
    const skip = () => experienceStore.getState().finishBoot();
    const timer = window.setTimeout(skip, MAX_BOOT_MS);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [booting]);

  if (!booting) return null;
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-x-0 top-[22%] z-20 flex flex-col items-center gap-3"
    >
      <p className="text-muted type-mono text-sm">powering on</p>
      <span className="bg-line block h-px w-24 overflow-hidden">
        <span className="bg-accent block h-full w-full origin-left animate-[boot_1.6s_ease-out_forwards]" />
      </span>
      <button
        type="button"
        onClick={() => experienceStore.getState().finishBoot()}
        className="text-muted hover:text-fg pointer-events-auto text-xs underline-offset-4 hover:underline"
      >
        Skip intro
      </button>
    </div>
  );
}
