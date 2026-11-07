import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import type { PerspectiveCamera } from "three";
import { overviewPose } from "./camera-presets";

/** Places the camera at the overview. Animation arrives in a later step. */
export function CameraRig() {
  const get = useThree((s) => s.get);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));

  useLayoutEffect(() => {
    const camera = get().camera as PerspectiveCamera;
    const pose = overviewPose(aspect);
    camera.position.copy(pose.position);
    camera.fov = pose.fov;
    camera.lookAt(pose.target);
    camera.updateProjectionMatrix();
  }, [get, aspect]);

  return null;
}
