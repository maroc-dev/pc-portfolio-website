import { ContactShadows } from "@react-three/drei";
import { DESK } from "./layout";
import { materials } from "./materials";

export function Desk() {
  return (
    <group>
      <mesh position={[0, -DESK.thickness / 2, DESK.z]} material={materials.wood} receiveShadow>
        <boxGeometry args={[DESK.width, DESK.thickness, DESK.depth]} />
      </mesh>
      {/* Felt desk mat under the keyboard. */}
      <mesh position={[-0.22, 0.0015, 0.24]} material={materials.felt}>
        <boxGeometry args={[0.86, 0.003, 0.34]} />
      </mesh>
      <ContactShadows
        position={[0, 0.0005, 0]}
        scale={[DESK.width, DESK.depth + 0.4]}
        resolution={512}
        far={0.6}
        blur={2.4}
        opacity={0.45}
        frames={1}
        color="#1d2a40"
      />
    </group>
  );
}
