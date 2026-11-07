import { useMemo } from "react";
import { DoubleSide, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { Rod, alignY } from "./geometry";
import { materials, palette } from "./materials";

const BASE = new Vector3(-0.98, 0.02, -0.24);
const ELBOW = new Vector3(-0.93, 0.44, -0.2);
const HEAD = new Vector3(-0.74, 0.6, -0.04);
const AIM = new Vector3(-0.36, 0, 0.18);

const shadeMaterial = new MeshStandardMaterial({
  color: "#3a3430",
  metalness: 0.7,
  roughness: 0.4,
  side: DoubleSide,
});

/** Architect-style desk lamp; its spotlight is the scene's warm key light. */
export function Lamp() {
  const target = useMemo(() => {
    const object = new Object3D();
    object.position.copy(AIM);
    return object;
  }, []);
  const facing = useMemo(() => alignY(HEAD.clone().sub(AIM)), []);

  return (
    <group>
      <mesh position={[BASE.x, 0.01, BASE.z]} material={materials.caseMetal}>
        <cylinderGeometry args={[0.075, 0.085, 0.02, 32]} />
      </mesh>
      <Rod from={BASE} to={ELBOW} radius={0.008} material={materials.aluminium} />
      <Rod from={ELBOW} to={HEAD} radius={0.007} material={materials.aluminium} />
      <mesh position={ELBOW} material={materials.caseMetal}>
        <sphereGeometry args={[0.014, 16, 16]} />
      </mesh>
      <group position={HEAD} quaternion={facing}>
        {/* Shade opens downward towards the aim point (local -Y). */}
        <mesh position={[0, -0.04, 0]} material={shadeMaterial}>
          <cylinderGeometry args={[0.028, 0.075, 0.1, 32, 1, true]} />
        </mesh>
        <mesh position={[0, 0.012, 0]} material={shadeMaterial}>
          <cylinderGeometry args={[0.012, 0.028, 0.025, 24]} />
        </mesh>
        <mesh position={[0, -0.045, 0]} material={materials.bulb}>
          <sphereGeometry args={[0.022, 24, 16]} />
        </mesh>
      </group>
      <primitive object={target} />
      <spotLight
        position={HEAD}
        target={target}
        color={palette.lamp}
        intensity={2.4}
        angle={0.7}
        penumbra={0.9}
        decay={2}
        distance={3}
      />
    </group>
  );
}
