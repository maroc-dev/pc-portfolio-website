import { ContactShadows } from "@react-three/drei";
import { DESK } from "./layout";
import { materials } from "./materials";

export function Desk() {
  return (
    <group>
      <mesh position={[0, -DESK.thickness / 2, DESK.z]} material={materials.walnut} receiveShadow>
        <boxGeometry args={[DESK.width, DESK.thickness, DESK.depth]} />
      </mesh>
      {/* Felt desk mat under the keyboard. */}
      <mesh position={[-0.22, 0.0015, 0.24]} material={materials.felt}>
        <boxGeometry args={[0.86, 0.003, 0.34]} />
      </mesh>
      {/* Back wall catches the lamp's spill so the scene doesn't float in a void. */}
      <mesh position={[0, 1.2, -0.55]} material={materials.wall}>
        <planeGeometry args={[6, 3]} />
      </mesh>
      <ContactShadows
        position={[0, 0.0005, 0]}
        scale={[DESK.width, DESK.depth + 0.4]}
        resolution={512}
        far={0.6}
        blur={2.4}
        opacity={0.6}
        frames={1}
        color="#0d0b0a"
      />
    </group>
  );
}
