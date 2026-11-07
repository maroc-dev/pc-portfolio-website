import { RoundedBox, useCursor } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useRef, useState } from "react";
import { MathUtils, type Group, type MeshBasicMaterial } from "three";
import { experienceStore } from "@/state/experience-store";
import { LIGHT_SWITCH } from "../layout";
import { materials, palette } from "../materials";
import { runtime } from "../runtime";
import { Highlight } from "../interaction/Highlight";

/** Rocker tilt in radians: up for day, down for night. */
const TILT = 0.22;

/**
 * Wall light switch: flips between day (blinds open) and night (lamp on).
 * The header has the same control as a button for keyboard and screen-reader users.
 */
export function LightSwitch() {
  const rocker = useRef<Group>(null);
  const indicator = useRef<MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(() => {
    const t = runtime.daylight;
    if (rocker.current) rocker.current.rotation.x = MathUtils.lerp(TILT, -TILT, t);
    if (indicator.current) indicator.current.opacity = 1 - t;
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    experienceStore.getState().toggleTheme();
  };

  return (
    <Highlight active={hovered} strength="strong">
      <group
        position={LIGHT_SWITCH}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <RoundedBox
          args={[0.075, 0.115, 0.01]}
          radius={0.004}
          smoothness={2}
          material={materials.paint}
        />
        <group ref={rocker} position={[0, 0, 0.007]}>
          <RoundedBox
            args={[0.034, 0.06, 0.012]}
            radius={0.003}
            smoothness={2}
            material={materials.paint}
          />
        </group>
        {/* Little locator light that glows in the dark, like real switches */}
        <mesh position={[0, -0.045, 0.0055]}>
          <circleGeometry args={[0.0035, 16]} />
          <meshBasicMaterial ref={indicator} color={palette.glow} transparent toneMapped={false} />
        </mesh>
      </group>
    </Highlight>
  );
}
