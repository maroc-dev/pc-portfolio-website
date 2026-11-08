import { PART_ANCHORS } from "../../layout";
import { materials, palette } from "../../materials";
import { HitArea } from "../../interaction/HitArea";
import { Interactive, usePartAccent } from "../../interaction/Interactive";

const A = PART_ANCHORS.io;
const USB_A_X = [0.035, 0.055, 0.075, 0.095];

/** The power LED breathes slowly while the machine is on. */
const breathe = (t: number) => 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.8));

/** Front I/O on the top cap: USB-C, audio, reset, power and four USB-A ports. */
export function FrontIO() {
  const glow = usePartAccent(palette.glow, breathe, 3);
  return (
    <Interactive id="io" accents={[glow]}>
      <group position={A}>
        {/* USB-C, headset and mic jacks */}
        <mesh position={[-0.09, 0, 0.0008]} material={materials.rubber}>
          <boxGeometry args={[0.009, 0.0035, 0.002]} />
        </mesh>
        {[-0.072, -0.06].map((x) => (
          <mesh
            key={x}
            position={[x, 0, 0.0008]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.rubber}
          >
            <cylinderGeometry args={[0.0026, 0.0026, 0.002, 16]} />
          </mesh>
        ))}
        {/* Reset */}
        <mesh position={[-0.035, 0, 0.0008]} material={materials.rubber}>
          <boxGeometry args={[0.004, 0.008, 0.002]} />
        </mesh>
        {/* Power button with glowing ring */}
        <mesh
          position={[-0.008, 0, 0.0015]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.caseWhite}
        >
          <cylinderGeometry args={[0.009, 0.009, 0.003, 32]} />
        </mesh>
        <mesh position={[-0.008, 0, 0.0032]} material={glow.material}>
          <torusGeometry args={[0.0097, 0.0012, 8, 40]} />
        </mesh>
        {USB_A_X.map((x) => (
          <mesh key={x} position={[x, 0, 0.0008]} material={materials.rubber}>
            <boxGeometry args={[0.012, 0.005, 0.002]} />
          </mesh>
        ))}
      </group>
      <HitArea size={[0.23, 0.04, 0.03]} position={[A.x, A.y, A.z]} />
    </Interactive>
  );
}
