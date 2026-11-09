"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { duration } from "@/lib/motion/tokens";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore, useExperience } from "@/state/experience-store";
import { Cable } from "./Cable";
import { CameraRig } from "./camera/CameraRig";
import { Desk } from "./Desk";
import { Effects } from "./effects/Effects";
import { Assemble } from "./intro/Assemble";
import { INTRO } from "./intro/schedule";
import { Keyboard } from "./Keyboard";
import { Lamp } from "./Lamp";
import { Lighting } from "./Lighting";
import { Monitor } from "./Monitor";
import { Mug } from "./Mug";
import { LightSwitch } from "./room/LightSwitch";
import { Room } from "./room/Room";
import { SunShafts } from "./room/SunShafts";
import { PowerLights } from "./PowerLights";
import { EthernetCable } from "./server/EthernetCable";
import { MiniServer } from "./server/MiniServer";
import { ShadowCasting } from "./ShadowCasting";
import { TagAnchors } from "./TagAnchors";
import { ThemeDriver } from "./ThemeDriver";
import { PcTower } from "./tower/PcTower";

/**
 * Render resolution. Capable devices render at 1.5–2× (supersampling on 1× screens keeps edges
 * and textures crisp); slowdowns step it down gradually before effects are ever switched off.
 */
const MAX_DPR = 2;
const MIN_DPR = 1.25;
const LOW_DPR = 1.25;

function startingDpr(high: boolean): number {
  if (!high) return LOW_DPR;
  return Math.min(MAX_DPR, Math.max(1.5, window.devicePixelRatio || 1));
}

/**
 * True once full view has finished zooming in. The window then covers the scene, so there's no
 * point redrawing it every frame: rendering drops to on-demand (a resize still redraws once) and
 * resumes the moment full view is left, before the camera starts moving back.
 */
function useCoveredByWindow(): boolean {
  const fullView = useExperience((s) => s.fullView);
  const [settled, setSettled] = useState(false);
  if (!fullView && settled) setSettled(false);

  useEffect(() => {
    if (!fullView) return;
    const timer = window.setTimeout(() => setSettled(true), duration.zoom * 1000 + 200);
    return () => window.clearTimeout(timer);
  }, [fullView]);

  return fullView && settled;
}

/** The WebGL scene. Loaded client-side only; the page is fully usable without it. */
export default function SceneCanvas() {
  const quality = useExperience((s) => s.quality);
  const reducedMotion = useReducedMotion();
  const high = quality === "high";
  const [dpr, setDpr] = useState(() => startingDpr(high));
  const covered = useCoveredByWindow();

  return (
    <Canvas
      dpr={high ? dpr : LOW_DPR}
      shadows={high ? "percentage" : false}
      // Always antialias the canvas itself, so edges stay smooth even if effects switch off.
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, near: 0.05, far: 20 }}
      frameloop={reducedMotion || covered ? "demand" : "always"}
      onCreated={({ gl }) => {
        experienceStore.getState().setScene("ready");
        gl.domElement.addEventListener("webglcontextlost", () => {
          experienceStore.getState().setScene("unavailable");
        });
      }}
      onPointerMissed={() => experienceStore.getState().hover(null)}
    >
      <color attach="background" args={["#cfe2f6"]} />
      <fog attach="fog" args={["#cfe2f6", 3, 7]} />
      <PerformanceMonitor
        flipflops={4}
        onIncline={() => setDpr(startingDpr(true))}
        onDecline={() => setDpr((d) => Math.max(MIN_DPR, d - 0.25))}
        onFallback={() => experienceStore.getState().setQuality("low")}
      />
      <ThemeDriver />
      <PowerLights />
      <Suspense fallback={null}>
        {/* First, so the camera is placed before anything projects through it this frame. */}
        <CameraRig />
        <Lighting shadows={high} />
        <Room />
        <Assemble step={INTRO.desk}>
          <Desk />
        </Assemble>
        <Assemble step={INTRO.lamp}>
          <Lamp />
        </Assemble>
        <Assemble step={INTRO.keyboard}>
          <Keyboard />
        </Assemble>
        <Assemble step={INTRO.mug}>
          <Mug />
        </Assemble>
        <Assemble step={INTRO.monitor}>
          <Monitor />
        </Assemble>
        <PcTower />
        <Assemble step={INTRO.server}>
          <MiniServer />
        </Assemble>
        <Cable />
        <EthernetCable />
        <Assemble step={INTRO.lightSwitch}>
          <LightSwitch />
        </Assemble>
        <TagAnchors />
        <SunShafts dust={high && !reducedMotion} />
        <ShadowCasting enabled={high} />
      </Suspense>
      {high && <Effects />}
    </Canvas>
  );
}
