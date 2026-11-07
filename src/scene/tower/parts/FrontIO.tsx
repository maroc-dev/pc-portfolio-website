import { PART_ANCHORS } from "../../layout";
import { materials, palette } from "../../materials";
import { HitArea } from "../../interaction/HitArea";
import { Interactive, usePartAccent } from "../../interaction/Interactive";

const A = PART_ANCHORS.io;
const USB_A = [-0.065, -0.045];

/** The power LED breathes slowly while the machine is on. */
const breathe = (t: number) => 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.8));

/** Front I/O on the top panel: ports and the power button. */
export function FrontIO() {
  const glow = usePartAccent(palette.amber, breathe, 3);
  return (
    <Interactive id="io" accents={[glow]}>
      <group position={[A.x, A.y, 0]}>
        <mesh position={[0, 0.002, 0]} material={materials.darkPlastic}>
          <boxGeometry args={[0.045, 0.004, 0.18]} />
        </mesh>
        {USB_A.map((z) => (
          <mesh key={z} position={[0, 0.0042, z]} material={materials.rubber}>
            <boxGeometry args={[0.005, 0.0012, 0.013]} />
          </mesh>
        ))}
        <mesh position={[0, 0.0042, -0.025]} material={materials.rubber}>
          <boxGeometry args={[0.0035, 0.0012, 0.009]} />
        </mesh>
        <mesh position={[0, 0.0042, -0.008]} material={materials.rubber}>
          <cylinderGeometry args={[0.0028, 0.0028, 0.0012, 16]} />
        </mesh>
        <mesh position={[0, 0.0055, 0.05]} material={materials.aluminium}>
          <cylinderGeometry args={[0.009, 0.009, 0.003, 32]} />
        </mesh>
        <mesh position={[0, 0.0058, 0.05]} rotation={[-Math.PI / 2, 0, 0]} material={glow.material}>
          <torusGeometry args={[0.0098, 0.0013, 8, 40]} />
        </mesh>
      </group>
      <HitArea size={[0.06, 0.03, 0.2]} position={[A.x, A.y + 0.012, 0]} />
    </Interactive>
  );
}
