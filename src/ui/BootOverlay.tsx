"use client";

import { useEffect } from "react";
import { experienceStore, useExperience } from "@/state/experience-store";

/**
 * Safety net only: once the scene has loaded it plays and ends the intro itself. This catches a
 * scene that never gets going, so the page can't stay in its intro state.
 */
const MAX_LOAD_MS = 12000;

/**
 * A strip of label tape "prints" while the desk assembles and the PC powers on. Never blocks: navigation works
 * throughout, and any key, click or the skip button jumps to the finished scene.
 */
export function BootOverlay() {
  const booting = useExperience((s) => s.phase === "boot");
  const sceneReady = useExperience((s) => s.scene === "ready");

  useEffect(() => {
    if (!booting) return;
    const skip = () => experienceStore.getState().finishBoot();
    const timer = sceneReady ? undefined : window.setTimeout(skip, MAX_LOAD_MS);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [booting, sceneReady]);

  if (!booting) return null;
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-x-0 bottom-28 z-20 flex flex-col items-center gap-3 md:bottom-32"
    >
      <p className="tape animate-[print-tape_1.3s_steps(19)_0.2s_both] text-sm">
        Setting up the desk
      </p>
      <button
        type="button"
        onClick={() => experienceStore.getState().finishBoot()}
        className="text-muted hover:text-fg bg-panel/90 pointer-events-auto rounded px-2 py-0.5 text-xs underline-offset-4 hover:underline"
      >
        Skip intro
      </button>
    </div>
  );
}
