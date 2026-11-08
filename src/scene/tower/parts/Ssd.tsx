import { PART_ANCHORS, TOWER } from "../../layout";
import { materials, palette } from "../../materials";
import { HitArea } from "../../interaction/HitArea";
import { Interactive, usePartAccent } from "../../interaction/Interactive";

const A = PART_ANCHORS.ssd;
const Z = TOWER.boardZ;
const FINS = [-0.008, -0.0027, 0.0027, 0.008];

/** Activity LED flickers in short bursts, like reads and writes. */
const activity = (t: number) => (Math.sin(t * 9) * Math.sin(t * 2.3) > 0.45 ? 1.8 : 0.35);

/** M.2 drive under a finned heatsink. */
export function Ssd() {
  const led = usePartAccent(palette.signal, activity, 3);
  return (
    <Interactive id="ssd" accents={[led]}>
      <group position={[A.x, A.y, 0]}>
        <mesh position={[0, 0, Z + 0.0035]} material={materials.aluminium}>
          <boxGeometry args={[0.085, 0.024, 0.005]} />
        </mesh>
        {FINS.map((y) => (
          <mesh key={y} position={[0, y, Z + 0.0068]} material={materials.aluminium}>
            <boxGeometry args={[0.078, 0.0018, 0.0016]} />
          </mesh>
        ))}
        <mesh position={[0.047, 0, Z + 0.004]} material={led.material}>
          <boxGeometry args={[0.005, 0.005, 0.003]} />
        </mesh>
      </group>
      <HitArea size={[0.11, 0.045, 0.03]} position={[A.x, A.y, Z + 0.012]} />
    </Interactive>
  );
}
