import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  Color,
  DoubleSide,
  MeshStandardMaterial,
  Object3D,
  Vector3,
  type MeshBasicMaterial,
  type SpotLight,
} from "three";
import { Rod, alignY } from "./geometry";
import { materials, palette } from "./materials";
import { runtime } from "./runtime";

const BASE = new Vector3(-1.02, 0.02, 0.02);
const ELBOW = new Vector3(-0.98, 0.34, -0.01);
const HEAD = new Vector3(-0.82, 0.43, 0.1);
const AIM = new Vector3(-0.4, 0, 0.26);
const LAMP_INTENSITY = 2.6;

const shadeMaterial = new MeshStandardMaterial({
  color: "#f2f5f9",
  metalness: 0.2,
  roughness: 0.4,
  side: DoubleSide,
});
const BULB_OFF = new Color("#d9dde4");
const BULB_ON = new Color("#ffe2b8");

/** A friendly white desk lamp. It switches on when the room goes dark. */
export function Lamp() {
  const spot = useRef<SpotLight>(null);
  const bulb = useRef<MeshBasicMaterial>(null);
  const target = useMemo(() => {
    const object = new Object3D();
    object.position.copy(AIM);
    return object;
  }, []);
  const facing = useMemo(() => alignY(HEAD.clone().sub(AIM)), []);

  useFrame(() => {
    const on = 1 - runtime.daylight;
    if (spot.current) spot.current.intensity = LAMP_INTENSITY * on;
    if (bulb.current) bulb.current.color.copy(BULB_OFF).lerp(BULB_ON, on);
  });

  return (
    <group>
      <mesh position={[BASE.x, 0.01, BASE.z]} material={materials.paint}>
        <cylinderGeometry args={[0.075, 0.085, 0.02, 32]} />
      </mesh>
      <Rod from={BASE} to={ELBOW} radius={0.008} material={materials.aluminium} />
      <Rod from={ELBOW} to={HEAD} radius={0.007} material={materials.aluminium} />
      <mesh position={ELBOW} material={materials.paint}>
        <sphereGeometry args={[0.014, 16, 16]} />
      </mesh>
      <group position={HEAD} quaternion={facing}>
        <mesh position={[0, -0.04, 0]} material={shadeMaterial}>
          <cylinderGeometry args={[0.028, 0.075, 0.1, 32, 1, true]} />
        </mesh>
        <mesh position={[0, 0.012, 0]} material={shadeMaterial}>
          <cylinderGeometry args={[0.012, 0.028, 0.025, 24]} />
        </mesh>
        <mesh position={[0, -0.045, 0]}>
          <sphereGeometry args={[0.022, 24, 16]} />
          <meshBasicMaterial ref={bulb} toneMapped={false} />
        </mesh>
      </group>
      <primitive object={target} />
      <spotLight
        ref={spot}
        position={HEAD}
        target={target}
        color={palette.lamp}
        intensity={0}
        angle={0.7}
        penumbra={0.9}
        decay={2}
        distance={3}
      />
    </group>
  );
}
