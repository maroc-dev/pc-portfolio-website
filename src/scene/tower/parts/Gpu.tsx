import { RoundedBox } from "@react-three/drei";
import { PART_ANCHORS } from "../../layout";
import { materials, palette } from "../../materials";
import { Interactive, usePartAccent } from "../../interaction/Interactive";
import { Fan } from "../Fan";

const A = PART_ANCHORS.gpu;
/** Vertical card: thickness along x, length along y, height (out from the board) along z. */
const THICK = 0.05;
const LENGTH = 0.3;
const HEIGHT = 0.12;
const FAN_Y = [-0.1, 0, 0.1];
const FINS = Array.from({ length: 13 }, (_, i) => -0.12 + i * 0.02);

/**
 * Vertically mounted graphics card on the left, fans facing the side glass as in Marco's build.
 * The front edge shows the heatsink fins and an unbranded light bar.
 */
export function Gpu() {
  const glow = usePartAccent(palette.amber, 0.6, 3);
  return (
    <Interactive id="gpu" accents={[glow]}>
      <group position={A}>
        <RoundedBox
          args={[THICK, LENGTH, HEIGHT]}
          radius={0.006}
          smoothness={3}
          material={materials.caseMetal}
        />
        {/* Backplate faces into the case */}
        <mesh position={[THICK / 2 + 0.001, 0, 0]} material={materials.aluminium}>
          <boxGeometry args={[0.002, LENGTH - 0.004, HEIGHT - 0.004]} />
        </mesh>
        {FAN_Y.map((y) => (
          <group key={y}>
            <mesh
              position={[-THICK / 2 - 0.0004, y, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              material={materials.rubber}
            >
              <circleGeometry args={[0.048, 48]} />
            </mesh>
            <Fan
              radius={0.044}
              position={[-THICK / 2 - 0.006, y, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              speed={5}
              boosted
            />
          </group>
        ))}
        {/* Heatsink fins along the front edge */}
        {FINS.map((y) => (
          <mesh key={y} position={[-0.004, y, HEIGHT / 2 + 0.001]} material={materials.aluminium}>
            <boxGeometry args={[THICK - 0.016, 0.003, 0.003]} />
          </mesh>
        ))}
        {/* Unbranded light bar on the front edge */}
        <mesh position={[THICK / 2 - 0.006, 0, HEIGHT / 2 + 0.0015]} material={glow.material}>
          <boxGeometry args={[0.004, LENGTH - 0.06, 0.003]} />
        </mesh>
      </group>
    </Interactive>
  );
}
