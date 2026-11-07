import { useEffect, useMemo } from "react";
import { MeshStandardMaterial } from "three";
import { materials } from "../materials";
import { createFinTexture } from "../textures/perforation";
import { Fan } from "./Fan";
import { CoolantTubes } from "./Cables";
import { RADIATOR_FANS_Y, RADIATOR_FAN_RADIUS, RADIATOR_FAN_X, RADIATOR_FAN_Z } from "./radiator";

/** 360 mm radiator on the right side with three fans, plumbed to the CPU pump. */
export function Cooling() {
  const core = useMemo(
    () =>
      new MeshStandardMaterial({
        map: createFinTexture("#2b3240", "#11151d", [1, 24]),
        metalness: 0.5,
        roughness: 0.55,
      }),
    [],
  );
  useEffect(
    () => () => {
      core.map?.dispose();
      core.dispose();
    },
    [core],
  );

  return (
    <group>
      <mesh position={[0.156, 0.268, RADIATOR_FAN_Z]} material={core}>
        <boxGeometry args={[0.026, 0.31, 0.12]} />
      </mesh>
      {/* End tanks */}
      {[0.11, 0.426].map((y) => (
        <mesh key={y} position={[0.156, y, RADIATOR_FAN_Z]} material={materials.darkPlastic}>
          <boxGeometry args={[0.03, 0.012, 0.124]} />
        </mesh>
      ))}
      {RADIATOR_FANS_Y.map((y) => (
        <Fan
          key={y}
          radius={RADIATOR_FAN_RADIUS}
          position={[RADIATOR_FAN_X, y, RADIATOR_FAN_Z]}
          rotation={[0, -Math.PI / 2, 0]}
          ring={materials.ledGlow}
          framed
          speed={3}
        />
      ))}
      <CoolantTubes />
    </group>
  );
}
