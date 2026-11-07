import { MeshStandardMaterial } from "three";
import { PART_ANCHORS } from "../../layout";
import { materials, palette } from "../../materials";
import { HitArea } from "../../interaction/HitArea";
import { Interactive, usePartAccent } from "../../interaction/Interactive";

const A = PART_ANCHORS.nic;
const pcbGreen = new MeshStandardMaterial({ color: "#1f3a33", metalness: 0.2, roughness: 0.6 });

/** Link light: mostly steady with occasional packet blinks. */
const linkLight = (t: number) => (Math.sin(t * 13) * Math.sin(t * 3.1) > 0.55 ? 2 : 0.5);

/** Expansion network card in the upper PCIe slot. */
export function NetworkCard() {
  const glow = usePartAccent(palette.teal, linkLight, 3);
  return (
    <Interactive id="nic" accents={[glow]}>
      <group position={A}>
        <mesh material={pcbGreen}>
          <boxGeometry args={[0.11, 0.0016, 0.055]} />
        </mesh>
        <mesh position={[0.01, 0.0045, 0]} material={materials.aluminium}>
          <boxGeometry args={[0.022, 0.007, 0.022]} />
        </mesh>
        <mesh position={[0, 0, -0.0285]} material={materials.gold}>
          <boxGeometry args={[0.04, 0.0017, 0.004]} />
        </mesh>
        {/* Glowing outer edge and link LED */}
        <mesh position={[0.005, 0.0012, 0.0272]} material={glow.material}>
          <boxGeometry args={[0.095, 0.0014, 0.0014]} />
        </mesh>
        <mesh position={[0.04, 0.0018, 0.018]} material={glow.material}>
          <boxGeometry args={[0.004, 0.002, 0.004]} />
        </mesh>
        {/* Rear bracket */}
        <mesh position={[-0.058, 0, 0]} material={materials.aluminium}>
          <boxGeometry args={[0.002, 0.03, 0.058]} />
        </mesh>
      </group>
      <HitArea size={[0.12, 0.03, 0.06]} position={[A.x, A.y, A.z]} />
    </Interactive>
  );
}
