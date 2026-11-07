import { RoundedBox } from "@react-three/drei";
import { MeshStandardMaterial, Vector3 } from "three";
import { GPU_YAW, PART_ANCHORS } from "../../layout";
import { materials, palette } from "../../materials";
import { Interactive, usePartAccent } from "../../interaction/Interactive";
import { Cable } from "../Cables";
import { Fan } from "../Fan";

const A = PART_ANCHORS.gpu;
/** Vertical card: thickness along x, length along y, height (out from the board) along z. */
const THICK = 0.05;
const LENGTH = 0.3;
const HEIGHT = 0.12;
const FAN_Y = [-0.1, 0, 0.1];
const FINS = Array.from({ length: 13 }, (_, i) => -0.12 + i * 0.02);
/** Silver-grey shroud like the real card. */
const shroud = new MeshStandardMaterial({ color: "#8d96a6", metalness: 0.6, roughness: 0.38 });

/** In the card's frame; the plinth top sits 0.155 below the card's centre. */
const POWER_LEAD = [
  new Vector3(THICK / 2 + 0.002, 0.07, HEIGHT / 2 - 0.02),
  new Vector3(THICK / 2 + 0.018, 0.04, HEIGHT / 2 - 0.005),
  new Vector3(THICK / 2 + 0.024, -0.08, HEIGHT / 2 - 0.03),
  new Vector3(THICK / 2 + 0.02, -0.158, 0.01),
];

/**
 * Vertically mounted graphics card on the left, turned towards the front glass so its three
 * fans are on show. The front edge shows the heatsink fins and an unbranded light bar.
 */
export function Gpu() {
  const glow = usePartAccent(palette.glow, 0.6, 3);
  return (
    <Interactive id="gpu" accents={[glow]}>
      <group position={A} rotation={[0, GPU_YAW, 0]}>
        <RoundedBox
          args={[THICK, LENGTH, HEIGHT]}
          radius={0.006}
          smoothness={3}
          material={shroud}
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
              dark
            />
          </group>
        ))}
        {/* Heatsink fins along the front edge */}
        {FINS.map((y) => (
          <mesh key={y} position={[-0.004, y, HEIGHT / 2 + 0.001]} material={materials.aluminium}>
            <boxGeometry args={[THICK - 0.016, 0.003, 0.003]} />
          </mesh>
        ))}
        {/* Braided power lead from the card's edge down into the PSU in the plinth */}
        <Cable points={POWER_LEAD} radius={0.0045} material={materials.rubber} />
        {/* Unbranded light bar on the front edge */}
        <mesh position={[THICK / 2 - 0.006, 0, HEIGHT / 2 + 0.0015]} material={glow.material}>
          <boxGeometry args={[0.004, LENGTH - 0.06, 0.003]} />
        </mesh>
      </group>
    </Interactive>
  );
}
