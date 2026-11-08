import { PerspectiveCamera, Vector3, type Camera } from "three";
import type { ScreenRect } from "@/state/experience-store";
import { monitorPose } from "./camera-presets";
import { MONITOR } from "./layout";

const { screenCenter: C, screenWidth: SW, screenHeight: SH } = MONITOR;

/** Corners of the monitor's visible screen, world space. */
export const SCREEN_CORNERS: readonly Vector3[] = [
  new Vector3(C.x - SW / 2, C.y + SH / 2, C.z),
  new Vector3(C.x + SW / 2, C.y + SH / 2, C.z),
  new Vector3(C.x - SW / 2, C.y - SH / 2, C.z),
  new Vector3(C.x + SW / 2, C.y - SH / 2, C.z),
];

const scratch = new Vector3();

/** Bounding box of `corners` projected into canvas pixels. */
export function projectRect(
  corners: readonly Vector3[],
  camera: Camera,
  size: { width: number; height: number },
): ScreenRect {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const corner of corners) {
    scratch.copy(corner).project(camera);
    const x = ((scratch.x + 1) / 2) * size.width;
    const y = ((1 - scratch.y) / 2) * size.height;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
}

/** True when two rects differ by more than `tolerance` pixels on any edge. */
export function rectChanged(a: ScreenRect | null, b: ScreenRect, tolerance = 0.5): boolean {
  if (!a) return true;
  return (
    Math.abs(a.left - b.left) > tolerance ||
    Math.abs(a.top - b.top) > tolerance ||
    Math.abs(a.width - b.width) > tolerance ||
    Math.abs(a.height - b.height) > tolerance
  );
}

const restCamera = new PerspectiveCamera();

/**
 * Where the screen sits in the normal (not full view) monitor framing, rounded to whole pixels.
 * The content window is laid out at this size, so text stays crisp at rest.
 */
export function restScreenRect(size: { width: number; height: number }): ScreenRect {
  const aspect = size.width / Math.max(1, size.height);
  const pose = monitorPose(aspect);
  restCamera.fov = pose.fov;
  restCamera.aspect = aspect;
  restCamera.position.copy(pose.position);
  restCamera.lookAt(pose.target);
  restCamera.updateProjectionMatrix();
  restCamera.updateMatrixWorld();
  const rect = projectRect(SCREEN_CORNERS, restCamera, size);
  return {
    left: Math.round(rect.left),
    top: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}
