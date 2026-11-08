import { useMemo } from "react";
import { Quaternion, Vector3, type Material } from "three";

const UP = new Vector3(0, 1, 0);

interface RodProps {
  from: Vector3;
  to: Vector3;
  radius: number;
  material: Material;
  radialSegments?: number;
}

/** A cylinder spanning two points; used for lamp arms, posts and pipes. */
export function Rod({ from, to, radius, material, radialSegments = 12 }: RodProps) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = to.clone().sub(from);
    return {
      position: from.clone().add(to).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
      length: dir.length(),
    };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion} material={material}>
      <cylinderGeometry args={[radius, radius, length, radialSegments]} />
    </mesh>
  );
}

/** Quaternion that turns +Y to face along `direction`. */
export function alignY(direction: Vector3): Quaternion {
  return new Quaternion().setFromUnitVectors(UP, direction.clone().normalize());
}
