import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { DESK } from "./layout";
import { materials } from "./materials";
import { createWoodTextures } from "./textures/wood";

const APRON_INSET = 0.06;

/** Solid light-oak desk with a softly rounded edge, a slim apron, and a felt mat. */
export function Desk() {
  const wood = useMemo(() => createWoodTextures(), []);
  useEffect(
    () => () => {
      wood.map.dispose();
      wood.roughnessMap.dispose();
    },
    [wood],
  );

  return (
    <group>
      <mesh position={[0, -DESK.thickness / 2, DESK.z]}>
        <boxGeometry args={[DESK.width, DESK.thickness, DESK.depth]} />
        <meshStandardMaterial
          map={wood.map}
          roughnessMap={wood.roughnessMap}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Rounded front lip so the edge catches the light like a real table top */}
      <RoundedBox
        args={[DESK.width, DESK.thickness, 0.03]}
        radius={0.012}
        smoothness={4}
        position={[0, -DESK.thickness / 2, DESK.z + DESK.depth / 2 - 0.012]}
      >
        <meshStandardMaterial map={wood.map} roughness={0.55} metalness={0} />
      </RoundedBox>
      {/* Apron under the top */}
      <mesh position={[0, -DESK.thickness - 0.04, DESK.z + DESK.depth / 2 - APRON_INSET]}>
        <boxGeometry args={[DESK.width - 0.2, 0.08, 0.02]} />
        <meshStandardMaterial map={wood.map} roughness={0.6} metalness={0} />
      </mesh>
      {/* Felt desk mat under the keyboard. */}
      <RoundedBox
        args={[0.86, 0.003, 0.34]}
        radius={0.0015}
        smoothness={2}
        position={[-0.22, 0.0015, 0.24]}
        material={materials.felt}
      />
      <ContactShadows
        position={[0, 0.0005, 0]}
        scale={[DESK.width, DESK.depth + 0.4]}
        resolution={1024}
        far={0.6}
        blur={2.4}
        opacity={0.45}
        frames={1}
        color="#1d2a40"
      />
    </group>
  );
}
