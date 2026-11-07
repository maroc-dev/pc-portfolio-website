import { PART_ANCHORS, TOWER } from "../../layout";
import { materials, palette } from "../../materials";
import { HitArea } from "../../interaction/HitArea";
import { Interactive, usePartAccent } from "../../interaction/Interactive";

const A = PART_ANCHORS.ram;
const Z = TOWER.boardZ;
/** The board is rotated, so DIMMs run horizontally below the CPU. */
const STICKS = [0.007, -0.007];
const LENGTH = 0.125;

/** Light bars shimmer gently: memory is always busy. */
const shimmer = (t: number) => 0.5 + 0.12 * Math.sin(t * 2.2);

export function Ram() {
  const glow = usePartAccent(palette.glow, shimmer, 2.8);
  return (
    <Interactive id="ram" accents={[glow]}>
      {STICKS.map((dy) => (
        <group key={dy} position={[A.x, A.y + dy, 0]}>
          <mesh position={[0, 0, Z + 0.004]} material={materials.darkPlastic}>
            <boxGeometry args={[LENGTH + 0.012, 0.009, 0.006]} />
          </mesh>
          <mesh position={[0, 0, Z + 0.02]} material={materials.caseWhite}>
            <boxGeometry args={[LENGTH, 0.0065, 0.03]} />
          </mesh>
          <mesh position={[0, 0, Z + 0.0375]} material={glow.material}>
            <boxGeometry args={[LENGTH - 0.004, 0.007, 0.005]} />
          </mesh>
        </group>
      ))}
      <HitArea size={[LENGTH + 0.02, 0.04, 0.05]} position={[A.x, A.y, Z + 0.025]} />
    </Interactive>
  );
}
