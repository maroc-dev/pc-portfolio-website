"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { pickQualityTier, readDeviceHints, supportsWebGL } from "@/lib/device/quality";
import { experienceStore, useExperience } from "@/state/experience-store";
import { useThemeSync } from "@/state/use-theme-sync";
import { useUrlSync } from "@/state/use-url-sync";
import { BootOverlay } from "@/ui/BootOverlay";
import { ExploreHint } from "@/ui/ExploreHint";
import { HoverLabel } from "@/ui/HoverLabel";
import { PartDock } from "@/ui/PartDock";
import { PartTags } from "@/ui/PartTags";
import { ScreenWindow } from "@/ui/ScreenWindow";
import { SiteHeader } from "@/ui/SiteHeader";
import { StaticFallback } from "@/ui/StaticFallback";

const SceneCanvas = dynamic(() => import("@/scene/SceneCanvas"), { ssr: false });

/**
 * Composes the 3D scene with the DOM interface. This is the only place that knows about both;
 * they communicate through the experience store.
 *
 * Desktop: the scene fills the viewport with header, dock and window layered on top.
 * Phones: header, a scene "hero", then the dock as a grid; sections open as a sheet.
 */
export function ExperienceShell() {
  const scene = useExperience((s) => s.scene);
  useUrlSync();
  useThemeSync();

  useEffect(() => {
    const store = experienceStore.getState();
    store.setQuality(pickQualityTier(readDeviceHints()));
    if (!supportsWebGL()) {
      store.setScene("unavailable");
      store.finishBoot();
    }
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col md:block md:h-dvh md:overflow-hidden">
      <SiteHeader />
      <div className="relative h-[56svh] md:absolute md:inset-0 md:h-auto">
        <div aria-hidden="true" className="absolute inset-0">
          {scene !== "unavailable" && <SceneCanvas />}
        </div>
        {scene === "unavailable" ? <StaticFallback /> : <BootOverlay />}
        <PartTags />
        <ScreenWindow />
      </div>
      <ExploreHint />
      <PartDock />
      <HoverLabel />
    </div>
  );
}
