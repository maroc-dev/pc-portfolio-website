"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore, useExperience } from "@/state/experience-store";
import { Cable } from "./Cable";
import { CameraRig } from "./camera/CameraRig";
import { Desk } from "./Desk";
import { Keyboard } from "./Keyboard";
import { Lamp } from "./Lamp";
import { Lighting } from "./Lighting";
import { Monitor } from "./Monitor";
import { Mug } from "./Mug";
import { PcTower } from "./tower/PcTower";

const DPR = { high: [1, 1.75], low: [1, 1.25] } as const;

/** The WebGL scene. Loaded client-side only; the page is fully usable without it. */
export default function SceneCanvas() {
  const quality = useExperience((s) => s.quality);
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={[...DPR[quality]]}
      gl={{ antialias: quality === "high", powerPreference: "high-performance" }}
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
      <color attach="background" args={["#1d1b19"]} />
      <fog attach="fog" args={["#1d1b19", 2.6, 6]} />
      <PerformanceMonitor onDecline={() => experienceStore.getState().setQuality("low")} />
      <Suspense fallback={null}>
        <Lighting />
        <Desk />
        <Lamp />
        <Keyboard />
        <Mug />
        <Monitor />
        <PcTower />
        <Cable />
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}
