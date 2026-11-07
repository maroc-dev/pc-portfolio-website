import { useMemo } from "react";
import { LatheGeometry, MeshPhysicalMaterial, MeshStandardMaterial, Vector2 } from "three";
import { Steam } from "./Steam";

const POSITION: [number, number, number] = [0.2, 0, 0.3];
const RIM = 0.088;
const COFFEE = 0.074;

const ceramic = new MeshPhysicalMaterial({
  color: "#f6f8fb",
  roughness: 0.28,
  metalness: 0,
  clearcoat: 0.6,
  clearcoatRoughness: 0.2,
});
const band = new MeshStandardMaterial({ color: "#3d7be0", roughness: 0.35, metalness: 0 });
const coffee = new MeshPhysicalMaterial({
  color: "#2a170c",
  roughness: 0.08,
  metalness: 0,
  clearcoat: 1,
});

/** Mug wall profile (radius, height): outer wall, a rounded lip, then the inner wall down. */
function mugProfile(): Vector2[] {
  const points: Vector2[] = [
    new Vector2(0, 0),
    new Vector2(0.028, 0),
    new Vector2(0.03, 0.004),
    new Vector2(0.0325, RIM - 0.004),
  ];
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * Math.PI;
    points.push(
      new Vector2(0.03 + 0.0025 * Math.cos(a) + 0.0003, RIM - 0.004 + 0.003 * Math.sin(a)),
    );
  }
  points.push(new Vector2(0.0275, 0.008), new Vector2(0, 0.008));
  return points;
}

/** A mug of hot coffee: small, but it says someone works here. */
export function Mug() {
  const body = useMemo(() => new LatheGeometry(mugProfile(), 64), []);

  return (
    <group>
      <group position={POSITION} rotation={[0, -0.6, 0]}>
        <mesh geometry={body} material={ceramic} />
        <mesh position={[0, 0.058, 0]} material={band}>
          <cylinderGeometry args={[0.0327, 0.0322, 0.014, 64, 1, true]} />
        </mesh>
        <mesh position={[0, COFFEE, 0]} rotation={[-Math.PI / 2, 0, 0]} material={coffee}>
          <circleGeometry args={[0.0276, 48]} />
        </mesh>
        <mesh position={[0.033, 0.046, 0]} rotation={[0, 0, -Math.PI / 2]} material={ceramic}>
          <torusGeometry args={[0.019, 0.0045, 16, 32, Math.PI]} />
        </mesh>
      </group>
      <Steam position={[POSITION[0], COFFEE + 0.005, POSITION[2]]} />
    </group>
  );
}
