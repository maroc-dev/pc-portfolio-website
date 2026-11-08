import { PART_ANCHORS, TOWER } from "../../layout";
import { materials, palette } from "../../materials";
import { HitArea } from "../../interaction/HitArea";
import { Interactive, usePartAccent } from "../../interaction/Interactive";

const A = PART_ANCHORS.cpu;
const Z = TOWER.boardZ;

/** CPU under an all-in-one cooler pump: "the core", with a glowing ring. */
export function Cpu() {
  const glow = usePartAccent(palette.glow, 0.7, 3.2);
  return (
    <Interactive id="cpu" accents={[glow]}>
      <group position={[A.x, A.y, 0]}>
        <mesh position={[0, 0, Z + 0.003]} material={materials.aluminium}>
          <boxGeometry args={[0.052, 0.052, 0.004]} />
        </mesh>
        <mesh
          position={[0, 0, Z + 0.016]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.caseMetal}
        >
          <cylinderGeometry args={[0.031, 0.034, 0.022, 48]} />
        </mesh>
        <mesh position={[0, 0, Z + 0.0272]} material={materials.darkPlastic}>
          <circleGeometry args={[0.03, 48]} />
        </mesh>
        <mesh position={[0, 0, Z + 0.0276]} material={glow.material}>
          <torusGeometry args={[0.025, 0.0022, 12, 64]} />
        </mesh>
        <mesh position={[0, 0, Z + 0.0278]} material={glow.material}>
          <circleGeometry args={[0.0055, 24]} />
        </mesh>
      </group>
      <HitArea size={[0.08, 0.08, 0.04]} position={[A.x, A.y, Z + 0.02]} />
    </Interactive>
  );
}
