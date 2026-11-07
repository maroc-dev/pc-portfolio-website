import { TOWER } from "../layout";
import { palette } from "../materials";
import { experienceStore } from "@/state/experience-store";
import { Wiring } from "./Cables";
import { CaseShell } from "./CaseShell";
import { Cooling } from "./Cooling";
import { Motherboard } from "./Motherboard";
import { Cpu } from "./parts/Cpu";
import { FrontIO } from "./parts/FrontIO";
import { Gpu } from "./parts/Gpu";
import { NetworkCard } from "./parts/NetworkCard";
import { Ram } from "./parts/Ram";
import { Ssd } from "./parts/Ssd";

/**
 * The tower, built in its own frame (see TOWER in layout.ts) and placed on the desk.
 * Hovering anywhere on it outlines every selectable part as a hint.
 */
export function PcTower() {
  return (
    <group
      position={TOWER.position}
      rotation={[0, TOWER.rotationY, 0]}
      scale={TOWER.scale}
      onPointerEnter={() => experienceStore.getState().setPcHovered(true)}
      onPointerLeave={() => experienceStore.getState().setPcHovered(false)}
    >
      <CaseShell />
      <Motherboard />
      <Cooling />
      <Wiring />
      <Cpu />
      <Ram />
      <Ssd />
      <NetworkCard />
      <Gpu />
      <FrontIO />

      {/* Soft blue interior fill from the LEDs so parts read through the glass. */}
      <pointLight
        position={[0, 0.37, -0.02]}
        color={palette.glow}
        intensity={0.35}
        distance={0.9}
        decay={2}
      />
    </group>
  );
}
