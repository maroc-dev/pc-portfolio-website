import { RoundedBox } from "@react-three/drei";
import { PART_ANCHORS } from "../../layout";
import { materials, palette } from "../../materials";
import { Interactive, usePartAccent } from "../../interaction/Interactive";
import { Fan } from "../Fan";

const A = PART_ANCHORS.gpu;
const L = 0.27;
const H = 0.115;
const T = 0.045;
const FAN_X = [-0.065, 0.065];

/** Vertically mounted graphics card so its fans face the glass. */
export function Gpu() {
  const glow = usePartAccent(palette.amber, 0.6, 3);
  return (
    <Interactive id="gpu" accents={[glow]}>
      <group position={A}>
        <RoundedBox args={[L, H, T]} radius={0.006} smoothness={3} material={materials.caseMetal} />
        <mesh position={[0, 0, -T / 2 - 0.001]} material={materials.aluminium}>
          <boxGeometry args={[L - 0.002, H - 0.003, 0.002]} />
        </mesh>
        {FAN_X.map((x) => (
          <group key={x}>
            <mesh position={[x, 0, T / 2 + 0.0004]} material={materials.rubber}>
              <circleGeometry args={[0.05, 48]} />
            </mesh>
            <Fan
              radius={0.044}
              position={[x, 0, T / 2 + 0.006]}
              ring={glow.material}
              speed={5}
              boosted
            />
          </group>
        ))}
        {/* Light bar along the top edge */}
        <mesh position={[0, H / 2 + 0.0008, T / 2 - 0.01]} material={glow.material}>
          <boxGeometry args={[L - 0.06, 0.0016, 0.004]} />
        </mesh>
        {/* Mounting bracket to the rear of the case */}
        <mesh position={[-L / 2 - 0.012, 0, -0.01]} material={materials.aluminium}>
          <boxGeometry args={[0.024, H + 0.01, 0.003]} />
        </mesh>
      </group>
    </Interactive>
  );
}
