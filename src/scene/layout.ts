import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import type { PartId } from "@/content/types";

/**
 * Single source of truth for where things sit on the desk (metres, desk top at y = 0).
 * Geometry components and camera presets both read from here, so moving the tower or the
 * monitor never desynchronises the camera.
 */

export const DESK = { width: 2.6, depth: 1.1, thickness: 0.05, z: 0.05 } as const;

export const MONITOR = {
  /** Centre of the visible screen surface, world space. */
  screenCenter: new Vector3(-0.32, 0.43, -0.18),
  screenWidth: 0.62,
  screenHeight: 0.3875, // 16:10
  bezel: 0.012,
  depth: 0.025,
} as const;

/** Tower in its own frame: x = depth (front is +x), y = up, z = width (glass side is +z). */
export const TOWER = {
  position: new Vector3(0.62, 0, -0.08),
  rotationY: -0.5,
  depth: 0.44,
  height: 0.48,
  width: 0.21,
  wall: 0.008,
  /** Top of the PSU shroud. */
  shroudHeight: 0.09,
  /** Inner face of the motherboard tray. */
  boardZ: -0.093,
} as const;

const towerQuaternion = new Quaternion().setFromEuler(new Euler(0, TOWER.rotationY, 0));
export const towerMatrix = new Matrix4().compose(
  TOWER.position,
  towerQuaternion,
  new Vector3(1, 1, 1),
);

/** Converts a point in the tower's frame to world space. */
export function towerToWorld(local: Vector3): Vector3 {
  return local.clone().applyMatrix4(towerMatrix);
}

/** Outward normal of the glass side panel, world space. */
export const glassNormal = new Vector3(0, 0, 1).applyQuaternion(towerQuaternion);

/** Centre of each selectable part, in the tower's frame (io sits on the top panel). */
export const PART_ANCHORS: Record<PartId, Vector3> = {
  cpu: new Vector3(-0.06, 0.36, -0.075),
  ram: new Vector3(0.045, 0.35, -0.075),
  ssd: new Vector3(-0.075, 0.285, -0.088),
  nic: new Vector3(-0.13, 0.236, -0.062),
  gpu: new Vector3(-0.04, 0.155, 0.035),
  io: new Vector3(0.19, TOWER.height, 0),
};

/** Signal cable from the tower's rear I/O to the back of the monitor stand, world space. */
export const CABLE_POINTS: Vector3[] = [
  towerToWorld(new Vector3(-TOWER.depth / 2 - 0.005, 0.3, 0)),
  towerToWorld(new Vector3(-TOWER.depth / 2 - 0.06, 0.2, 0.01)),
  new Vector3(0.22, 0.006, -0.3),
  new Vector3(-0.05, 0.006, -0.33),
  new Vector3(-0.3, 0.02, -0.29),
  new Vector3(-0.32, 0.12, -0.255),
];
