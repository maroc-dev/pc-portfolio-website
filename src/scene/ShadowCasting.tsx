import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { MeshPhysicalMaterial, MeshStandardMaterial, type Mesh } from "three";

/**
 * Lets every solid, lit mesh cast and receive the sun's shadow. Done once after the scene
 * mounts rather than flagging hundreds of meshes by hand; glass, LEDs and hit areas are skipped.
 */
export function ShadowCasting({ enabled }: { enabled: boolean }) {
  const get = useThree((s) => s.get);

  useEffect(() => {
    if (!enabled) return;
    get().scene.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh || mesh.userData.noOutline) return;
      const material = mesh.material;
      const lit =
        material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial;
      if (!lit || material.transparent) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [enabled, get]);

  return null;
}
