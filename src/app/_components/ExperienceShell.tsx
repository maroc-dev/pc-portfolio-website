"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { pickQualityTier, readDeviceHints, supportsWebGL } from "@/lib/device/quality";
import { experienceStore, useExperience } from "@/state/experience-store";
import { useUrlSync } from "@/state/use-url-sync";

const SceneCanvas = dynamic(() => import("@/scene/SceneCanvas"), { ssr: false });

/**
 * Composes the 3D scene with the DOM interface. This is the only place that knows about both;
 * they communicate through the experience store.
 */
export function ExperienceShell() {
  const scene = useExperience((s) => s.scene);
  useUrlSync();

  useEffect(() => {
    const store = experienceStore.getState();
    store.setQuality(pickQualityTier(readDeviceHints()));
    if (!supportsWebGL()) {
      store.setScene("unavailable");
      store.finishBoot();
    }
  }, []);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        {scene !== "unavailable" && <SceneCanvas />}
      </div>
    </div>
  );
}
