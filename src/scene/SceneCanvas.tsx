"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore, useExperience } from "@/state/experience-store";
import { Cable } from "./Cable";
import { CameraRig } from "./camera/CameraRig";
import { Desk } from "./Desk";
import { Effects } from "./effects/Effects";
import { Keyboard } from "./Keyboard";
import { Lamp } from "./Lamp";
import { Lighting } from "./Lighting";
import { Monitor } from "./Monitor";
import { Mug } from "./Mug";
import { LightSwitch } from "./room/LightSwitch";
import { Room } from "./room/Room";
import { SunShafts } from "./room/SunShafts";
import { ShadowCasting } from "./ShadowCasting";
import { TagAnchors } from "./TagAnchors";
import { ThemeDriver } from "./ThemeDriver";
import { PcTower } from "./tower/PcTower";

const DPR = { high: [1, 2], low: [1, 1.25] } as const;

/** The WebGL scene. Loaded client-side only; the page is fully usable without it. */
export default function SceneCanvas() {
  const quality = useExperience((s) => s.quality);
  const reducedMotion = useReducedMotion();
  const high = quality === "high";

  return (
    <Canvas
      dpr={[...DPR[quality]]}
      shadows={high ? "percentage" : false}
      gl={{ antialias: !high, powerPreference: "high-performance" }}
      camera={{ fov: 32, near: 0.05, far: 20 }}
      frameloop={reducedMotion ? "demand" : "always"}
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
      <PerformanceMonitor onDecline={() => experienceStore.getState().setQuality("low")} />
      <ThemeDriver />
      <Suspense fallback={null}>
        {/* First, so the camera is placed before anything projects through it this frame. */}
        <CameraRig />
        <Lighting shadows={high} />
        <Room />
        <Desk />
        <Lamp />
        <Keyboard />
        <Mug />
        <Monitor />
        <PcTower />
        <Cable />
        <LightSwitch />
        <TagAnchors />
        <SunShafts dust={high && !reducedMotion} />
        <ShadowCasting enabled={high} />
      </Suspense>
      {high && <Effects />}
    </Canvas>
  );
}
