import { PART_ANCHORS, TOWER } from "../../layout";
import { materials, palette } from "../../materials";
import { HitArea } from "../../interaction/HitArea";
import { Interactive, usePartAccent } from "../../interaction/Interactive";

const A = PART_ANCHORS.ram;
const Z = TOWER.boardZ;
const STICKS = [-0.009, 0.009];
const EMPTY_SLOTS = [0.027, 0.045];

/** Light bars shimmer gently: memory is always busy. */
const shimmer = (t: number) => 0.5 + 0.12 * Math.sin(t * 2.2);

export function Ram() {
  const glow = usePartAccent(palette.amber, shimmer, 2.8);
  return (
    <Interactive id="ram" accents={[glow]}>
      {[...STICKS, ...EMPTY_SLOTS].map((dx) => (
        <mesh key={dx} position={[A.x + dx, A.y, Z + 0.004]} material={materials.darkPlastic}>
          <boxGeometry args={[0.009, 0.14, 0.006]} />
        </mesh>
      ))}
      {STICKS.map((dx) => (
        <group key={dx} position={[A.x + dx, A.y, 0]}>
          <mesh position={[0, 0, Z + 0.02]} material={materials.caseMetal}>
            <boxGeometry args={[0.0065, 0.13, 0.03]} />
          </mesh>
          <mesh position={[0, 0, Z + 0.0375]} material={glow.material}>
            <boxGeometry args={[0.007, 0.126, 0.005]} />
          </mesh>
        </group>
      ))}
      <HitArea size={[0.04, 0.15, 0.05]} position={[A.x, A.y, Z + 0.025]} />
    </Interactive>
  );
}
