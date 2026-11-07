import { MeshBasicMaterial } from "three";

const invisible = new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
invisible.colorWrite = false;

interface HitAreaProps {
  size: [number, number, number];
  position?: [number, number, number];
}

/** Invisible box that enlarges a small part's pointer target. */
export function HitArea({ size, position }: HitAreaProps) {
  return (
    <mesh position={position} material={invisible}>
      <boxGeometry args={size} />
    </mesh>
  );
}
