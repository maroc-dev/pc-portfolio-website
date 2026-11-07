import { DoubleSide, MeshStandardMaterial } from "three";

const ceramic = new MeshStandardMaterial({
  color: "#d9cbb8",
  roughness: 0.35,
  metalness: 0,
  side: DoubleSide,
});
const coffee = new MeshStandardMaterial({ color: "#2a1a10", roughness: 0.15, metalness: 0 });

/** A mug of coffee: small, but it says someone works here. */
export function Mug() {
  return (
    <group position={[0.2, 0, 0.3]} rotation={[0, -0.6, 0]}>
      <mesh position={[0, 0.045, 0]} material={ceramic}>
        <cylinderGeometry args={[0.032, 0.029, 0.09, 32, 1, true]} />
      </mesh>
      <mesh position={[0, 0.003, 0]} material={ceramic}>
        <cylinderGeometry args={[0.029, 0.029, 0.006, 32]} />
      </mesh>
      <mesh position={[0, 0.078, 0]} rotation={[-Math.PI / 2, 0, 0]} material={coffee}>
        <circleGeometry args={[0.031, 32]} />
      </mesh>
      <mesh position={[0.032, 0.046, 0]} rotation={[0, 0, -Math.PI / 2]} material={ceramic}>
        <torusGeometry args={[0.02, 0.0045, 12, 24, Math.PI]} />
      </mesh>
    </group>
  );
}
