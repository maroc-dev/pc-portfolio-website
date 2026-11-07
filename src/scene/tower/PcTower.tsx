import { TOWER } from "../layout";
import { materials, palette } from "../materials";
import { CaseShell } from "./CaseShell";
import { Fan } from "./Fan";

const FRONT_FAN_Y = [0.15, 0.27, 0.39];

/** The tower, built in its own frame (see TOWER in layout.ts) and placed on the desk. */
export function PcTower() {
  return (
    <group position={TOWER.position} rotation={[0, TOWER.rotationY, 0]}>
      <CaseShell />

      {FRONT_FAN_Y.map((y) => (
        <Fan
          key={y}
          radius={0.052}
          position={[TOWER.depth / 2 - 0.032, y, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          ring={materials.ledAmber}
          framed
          speed={3.2}
        />
      ))}
      <Fan
        radius={0.048}
        position={[-TOWER.depth / 2 + 0.024, 0.37, -0.01]}
        rotation={[0, Math.PI / 2, 0]}
        framed
        speed={3.2}
      />

      {/* Warm interior fill so parts read through the glass. */}
      <pointLight
        position={[0, 0.3, 0.06]}
        color={palette.amber}
        intensity={0.35}
        distance={0.6}
        decay={2}
      />
    </group>
  );
}
