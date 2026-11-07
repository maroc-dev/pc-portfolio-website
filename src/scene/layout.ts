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

/**
 * Marco's tower: an octagonal showcase case. In its own frame x = width (left to right seen from
 * the front), y = up, z = depth with the front glass at +z. The motherboard is mounted on the back
 * wall rotated so its expansion slots sit at the top, as in the real build.
 */
export const TOWER = {
  position: new Vector3(0.6, 0, -0.1),
  rotationY: -0.3,
  width: 0.34,
  depth: 0.32,
  height: 0.48,
  /** Vertical corner chamfers of the octagonal footprint. */
  chamfer: 0.065,
  /** Base plinth and top cap heights; the glass sits between them. */
  plinth: 0.05,
  cap: 0.055,
  wall: 0.006,
  /** Top of the PSU shroud. */
  shroudHeight: 0.15,
  /** Front face of the motherboard. */
  boardZ: -0.132,
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

/** Outward normal of the front glass, world space. */
export const glassNormal = new Vector3(0, 0, 1).applyQuaternion(towerQuaternion);

/** Motherboard extent on the tray, in the tower's frame. */
export const BOARD = { minX: -0.085, maxX: 0.1, minY: 0.16, maxY: 0.415 } as const;

/** Maps a point on the board (tower frame) to texture UV (0..1, v up). */
export function boardUV(x: number, y: number): [number, number] {
  return [
    (x - BOARD.minX) / (BOARD.maxX - BOARD.minX),
    (y - BOARD.minY) / (BOARD.maxY - BOARD.minY),
  ];
}

/** Centre of each selectable part, in the tower's frame. */
export const PART_ANCHORS: Record<PartId, Vector3> = {
  cpu: new Vector3(0.03, 0.31, -0.115),
  ram: new Vector3(0.03, 0.238, -0.115),
  ssd: new Vector3(0.03, 0.193, -0.125),
  nic: new Vector3(-0.062, 0.365, -0.105),
  gpu: new Vector3(-0.122, 0.24, -0.06),
  /** Front I/O strip on the top cap's front face. */
  io: new Vector3(0, TOWER.height - TOWER.cap / 2, TOWER.depth / 2),
};

/** Display cable from the GPU outputs (top rear) down to the monitor stand, world space. */
export const CABLE_POINTS: Vector3[] = [
  towerToWorld(new Vector3(-0.1, TOWER.height - TOWER.cap, -TOWER.depth / 2 - 0.004)),
  towerToWorld(new Vector3(-0.1, 0.25, -TOWER.depth / 2 - 0.05)),
  new Vector3(0.24, 0.006, -0.36),
  new Vector3(-0.05, 0.006, -0.35),
  new Vector3(-0.3, 0.02, -0.29),
  new Vector3(-0.32, 0.12, -0.255),
];
