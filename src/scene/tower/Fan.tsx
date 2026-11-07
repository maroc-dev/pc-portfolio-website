import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  BoxGeometry,
  CylinderGeometry,
  MeshStandardMaterial,
  TorusGeometry,
  type Group,
  type Material,
} from "three";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { materials } from "../materials";

/** Pale, slightly glossy blades like the real fans. */
const bladeMaterial = new MeshStandardMaterial({ color: "#dbe5f3", roughness: 0.35, metalness: 0 });
import { runtime } from "../runtime";

/** Geometry is built at unit radius and shared by every fan; fans are scaled instead. */
const BLADES = 7;
const hubGeometry = new CylinderGeometry(0.3, 0.3, 0.22, 24).rotateX(Math.PI / 2);
/** Pitched about its own length (before the spoke rotation) so every blade stays in the fan plane. */
const BLADE_PITCH = 0.38;
const bladeGeometry = new BoxGeometry(0.62, 0.3, 0.02).rotateX(BLADE_PITCH).translate(0.62, 0, 0);
const ringGeometry = new TorusGeometry(0.98, 0.035, 8, 48);
const frameBar = new BoxGeometry(2.2, 0.16, 0.4);
const rimGeometry = new TorusGeometry(1.0, 0.06, 8, 48);
const FRAME_SIDES: { position: [number, number, number]; vertical: boolean }[] = [
  { position: [0, 1.02, 0], vertical: false },
  { position: [0, -1.02, 0], vertical: false },
  { position: [-1.02, 0, 0], vertical: true },
  { position: [1.02, 0, 0], vertical: true },
];

interface FanProps {
  radius: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** Radians per second at full power. */
  speed?: number;
  /** Optional glowing ring (the part's accent material, or a shared LED). */
  ring?: Material;
  /** Square frame for case fans; GPU fans sit in the shroud instead. */
  framed?: boolean;
  /** Use the GPU boost multiplier (spins up when the GPU is selected). */
  boosted?: boolean;
  /** Pale blades for case fans, dark for the graphics card. */
  dark?: boolean;
}

/** A fan facing +Z in its local frame. */
export function Fan({
  radius,
  position,
  rotation,
  speed = 4,
  ring,
  framed,
  boosted,
  dark,
}: FanProps) {
  const rotor = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!rotor.current || prefersReducedMotion()) return;
    const boost = boosted ? 1 + runtime.gpuBoost * 3 : 1;
    rotor.current.rotation.z -= speed * runtime.power * boost * delta;
  });

  return (
    <group position={position} rotation={rotation} scale={radius}>
      <group ref={rotor}>
        <mesh geometry={hubGeometry} material={dark ? materials.caseMetal : materials.caseWhite} />
        {Array.from({ length: BLADES }, (_, i) => (
          <mesh
            key={i}
            geometry={bladeGeometry}
            material={dark ? materials.darkPlastic : bladeMaterial}
            rotation={[0, 0, (i / BLADES) * Math.PI * 2]}
          />
        ))}
      </group>
      {ring && <mesh geometry={ringGeometry} material={ring} />}
      {framed && <mesh geometry={rimGeometry} material={materials.caseInner} />}
      {framed &&
        FRAME_SIDES.map(({ position: p, vertical }, i) => (
          <mesh
            key={i}
            geometry={frameBar}
            material={materials.caseInner}
            position={p}
            rotation={[0, 0, vertical ? Math.PI / 2 : 0]}
          />
        ))}
    </group>
  );
}
