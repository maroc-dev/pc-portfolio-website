import { TOWER } from "../layout";
import { palette } from "../materials";
import { CaseShell } from "./CaseShell";
import { Cooling } from "./Cooling";
import { Motherboard } from "./Motherboard";
import { Cpu } from "./parts/Cpu";
import { FrontIO } from "./parts/FrontIO";
import { Gpu } from "./parts/Gpu";
import { NetworkCard } from "./parts/NetworkCard";
import { Ram } from "./parts/Ram";
import { Ssd } from "./parts/Ssd";

/** The tower, built in its own frame (see TOWER in layout.ts) and placed on the desk. */
export function PcTower() {
  return (
    <group position={TOWER.position} rotation={[0, TOWER.rotationY, 0]}>
      <CaseShell />
      <Motherboard />
      <Cooling />
      <Cpu />
      <Ram />
      <Ssd />
      <NetworkCard />
      <Gpu />
      <FrontIO />

      {/* Warm interior fill so parts read through the glass. */}
      <pointLight
        position={[0, 0.37, -0.02]}
        color={palette.amber}
        intensity={0.22}
        distance={0.6}
        decay={2}
      />
    </group>
  );
}
