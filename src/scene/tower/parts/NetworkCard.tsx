import { MeshStandardMaterial } from "three";
import { PART_ANCHORS } from "../../layout";
import { materials, palette } from "../../materials";
import { HitArea } from "../../interaction/HitArea";
import { Interactive, usePartAccent } from "../../interaction/Interactive";

const A = PART_ANCHORS.nic;
const LENGTH = 0.1;
const HEIGHT = 0.055;
const pcbGreen = new MeshStandardMaterial({ color: "#1f3a33", metalness: 0.2, roughness: 0.6 });

/** Link light: mostly steady with occasional packet blinks. */
const linkLight = (t: number) => (Math.sin(t * 13) * Math.sin(t * 3.1) > 0.55 ? 2 : 0.5);

/**
 * Network card hanging from the top PCIe slot beside the GPU (not in the real build: added so
 * the distributed-systems section has a home).
 */
export function NetworkCard() {
  const glow = usePartAccent(palette.signal, linkLight, 3);
  return (
    <Interactive id="nic" accents={[glow]}>
      <group position={A}>
        <mesh material={pcbGreen}>
          <boxGeometry args={[0.0016, LENGTH, HEIGHT]} />
        </mesh>
        {/* Controller chip heatsink */}
        <mesh position={[0.004, -0.01, 0.004]} material={materials.aluminium}>
          <boxGeometry args={[0.007, 0.022, 0.022]} />
        </mesh>
        {/* Edge connector into the slot */}
        <mesh position={[0, 0.005, -HEIGHT / 2 - 0.002]} material={materials.gold}>
          <boxGeometry args={[0.0017, 0.04, 0.004]} />
        </mesh>
        {/* Glowing outer edge and link LED */}
        <mesh position={[0.0012, -0.004, HEIGHT / 2 - 0.0005]} material={glow.material}>
          <boxGeometry args={[0.0014, LENGTH - 0.012, 0.0014]} />
        </mesh>
        <mesh position={[0.0018, -LENGTH / 2 + 0.012, HEIGHT / 2 - 0.008]} material={glow.material}>
          <boxGeometry args={[0.002, 0.004, 0.004]} />
        </mesh>
        {/* Bracket up into the slot rail */}
        <mesh position={[0, LENGTH / 2 + 0.006, 0]} material={materials.aluminium}>
          <boxGeometry args={[0.018, 0.012, HEIGHT + 0.004]} />
        </mesh>
      </group>
      <HitArea size={[0.03, LENGTH + 0.01, HEIGHT + 0.01]} position={[A.x, A.y, A.z]} />
    </Interactive>
  );
}
