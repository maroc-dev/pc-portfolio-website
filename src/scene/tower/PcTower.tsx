import { TOWER } from "../layout";
import { palette } from "../materials";
import { runtime } from "../runtime";

const INTERIOR_LIGHT = 0.35;
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";
import { experienceStore } from "@/state/experience-store";
import { Assemble } from "../intro/Assemble";
import { INTRO } from "../intro/schedule";
import { Wiring } from "./Cables";
import { CaseShell } from "./CaseShell";
import { Cooling } from "./Cooling";
import { Motherboard } from "./Motherboard";
import { Cpu } from "./parts/Cpu";
import { FrontIO } from "./parts/FrontIO";
import { Gpu } from "./parts/Gpu";
import { Ram } from "./parts/Ram";
import { Ssd } from "./parts/Ssd";

/**
 * The tower, built in its own frame (see TOWER in layout.ts) and placed on the desk.
 * Hovering anywhere on it outlines every selectable part as a hint.
 */
export function PcTower() {
  const interior = useRef<PointLight>(null);
  useFrame(() => {
    if (interior.current) interior.current.intensity = INTERIOR_LIGHT * runtime.power;
  });

  return (
    <group
      position={TOWER.position}
      rotation={[0, TOWER.rotationY, 0]}
      scale={TOWER.scale}
      onPointerEnter={() => experienceStore.getState().setPcHovered(true)}
      onPointerLeave={() => experienceStore.getState().setPcHovered(false)}
    >
      <CaseShell />
      <Assemble step={INTRO.board}>
        <Motherboard />
      </Assemble>
      <Assemble step={INTRO.cpu}>
        <Cpu />
      </Assemble>
      <Assemble step={INTRO.ram}>
        <Ram />
      </Assemble>
      <Assemble step={INTRO.ssd}>
        <Ssd />
      </Assemble>
      <Assemble step={INTRO.gpu}>
        <Gpu />
      </Assemble>
      <Assemble step={INTRO.cooling}>
        <Cooling />
      </Assemble>
      <Assemble step={INTRO.wiring}>
        <Wiring />
      </Assemble>
      <Assemble step={INTRO.cap}>
        <FrontIO />
      </Assemble>

      {/* Soft blue interior fill from the LEDs so parts read through the glass. */}
      <pointLight
        ref={interior}
        position={[0, 0.37, -0.02]}
        color={palette.glow}
        intensity={0}
        distance={0.9}
        decay={2}
      />
    </group>
  );
}
