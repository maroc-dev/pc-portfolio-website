import { CatmullRomCurve3, Euler, Matrix4, Quaternion, Vector3 } from "three";
import type { PartId } from "@/content/types";

/**
 * Single source of truth for where things sit on the desk (metres, desk top at y = 0).
 * Geometry components and camera presets both read from here, so moving the tower or the
 * monitor never desynchronises the camera.
 */

export const DESK = { width: 2.6, depth: 1.1, thickness: 0.05, z: 0.05 } as const;

/** Back wall plane and the window cut into it (left of the monitor). */
export const WALL_Z = -0.55;
export const WINDOW = { x0: -1.2, x1: -0.48, y0: 0.5, y1: 1.3 } as const;

/** Sunlight travels in through the window, down and to the right, onto the desk. */
export const SUN_DIRECTION = new Vector3(0.62, -0.55, 0.56).normalize();
export const SUN_TARGET = new Vector3(-0.1, 0, 0.1);

/** Light switch on the wall between the monitor and the PC. */
export const LIGHT_SWITCH = new Vector3(0.16, 0.5, WALL_Z + 0.005);

export const MONITOR = {
  /** Centre of the visible screen surface, world space. */
  screenCenter: new Vector3(-0.32, 0.43, -0.18),
  screenWidth: 0.62,
  screenHeight: 0.3875, // 16:10
  bezel: 0.008,
  depth: 0.025,
} as const;

/**
 * Marco's tower: an octagonal showcase case. In its own frame x = width (left to right seen from
 * the front), y = up, z = depth with the front glass at +z. The motherboard is mounted on the back
 * wall rotated so its expansion slots sit at the top, as in the real build.
 */
export const TOWER = {
  position: new Vector3(0.64, 0, -0.12),
  rotationY: -0.3,
  /** Shown larger than life so the parts read clearly; everything below is in model units. */
  scale: 1.4,
  width: 0.34,
  depth: 0.32,
  height: 0.48,
  /** Vertical corner chamfers of the octagonal footprint. */
  chamfer: 0.065,
  /** Base plinth and top cap heights; the glass sits between them. */
  plinth: 0.11,
  cap: 0.055,
  wall: 0.006,
  /** Front face of the motherboard. */
  boardZ: -0.132,
} as const;

const towerQuaternion = new Quaternion().setFromEuler(new Euler(0, TOWER.rotationY, 0));
export const towerMatrix = new Matrix4().compose(
  TOWER.position,
  towerQuaternion,
  new Vector3(TOWER.scale, TOWER.scale, TOWER.scale),
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

/** The GPU is turned towards the front glass so its fans face the viewer. */
export const GPU_YAW = 0.7;

/** Parts that live inside (or on) the tower. */
export type TowerPartId = Exclude<PartId, "server">;

/** Centre of each tower part, in the tower's frame. */
export const PART_ANCHORS: Record<TowerPartId, Vector3> = {
  cpu: new Vector3(0.03, 0.31, -0.115),
  ram: new Vector3(0.03, 0.238, -0.115),
  ssd: new Vector3(0.03, 0.193, -0.125),
  gpu: new Vector3(-0.095, 0.276, -0.05),
  /** Front I/O strip on the top cap's front face. */
  io: new Vector3(0, TOWER.height - TOWER.cap / 2, TOWER.depth / 2),
};

/**
 * The mini server: a small PC on the desk between the monitor and the tower, turned to face
 * the viewer. Built in its own frame (front is +z, desk at y = 0).
 */
export const MINI_SERVER = {
  position: new Vector3(0.19, 0, -0.15),
  rotationY: -0.27,
  width: 0.18,
  height: 0.062,
  depth: 0.17,
} as const;

const serverQuaternion = new Quaternion().setFromEuler(new Euler(0, MINI_SERVER.rotationY, 0));
const serverMatrix = new Matrix4().compose(
  MINI_SERVER.position,
  serverQuaternion,
  new Vector3(1, 1, 1),
);

export function serverToWorld(local: Vector3): Vector3 {
  return local.clone().applyMatrix4(serverMatrix);
}

/** Outward normal of the mini server's front panel, world space. */
export const serverFront = new Vector3(0, 0, 1).applyQuaternion(serverQuaternion);

/** Where each selectable part sits in the world and which way it faces (close-ups, tags). */
export const PART_FOCUS: Record<PartId, { center: Vector3; facing: Vector3 }> = {
  cpu: { center: towerToWorld(PART_ANCHORS.cpu), facing: glassNormal },
  ram: { center: towerToWorld(PART_ANCHORS.ram), facing: glassNormal },
  ssd: { center: towerToWorld(PART_ANCHORS.ssd), facing: glassNormal },
  gpu: { center: towerToWorld(PART_ANCHORS.gpu), facing: glassNormal },
  io: { center: towerToWorld(PART_ANCHORS.io), facing: glassNormal },
  server: {
    center: serverToWorld(new Vector3(0, MINI_SERVER.height / 2, 0)),
    facing: serverFront,
  },
};

/**
 * Display cable: out of the tower's back panel, straight down behind it, flat along the back of
 * the desk (clear of the monitor base), then up into the monitor stand. World space.
 */
const CABLE_ON_DESK = 0.0075;
export const CABLE_POINTS: Vector3[] = [
  towerToWorld(new Vector3(-0.1, 0.32, -TOWER.depth / 2 - 0.003)),
  towerToWorld(new Vector3(-0.1, 0.27, -TOWER.depth / 2 - 0.03)),
  towerToWorld(new Vector3(-0.1, 0.06, -TOWER.depth / 2 - 0.04)),
  towerToWorld(new Vector3(-0.1, CABLE_ON_DESK / TOWER.scale, -TOWER.depth / 2 - 0.05)),
  new Vector3(0.3, CABLE_ON_DESK, -0.45),
  new Vector3(0.0, CABLE_ON_DESK, -0.43),
  new Vector3(-0.18, CABLE_ON_DESK, -0.37),
  new Vector3(-0.28, 0.03, -0.31),
  new Vector3(-0.32, 0.12, -0.25),
];

/** The cable's path. Low tension keeps it from overshooting into the desk between points. */
export function createCableCurve(): CatmullRomCurve3 {
  return new CatmullRomCurve3(CABLE_POINTS, false, "catmullrom", 0.2);
}

/**
 * Network cable from the mini server's rear port, back along the desk (in front of the display
 * cable), then up the tower's back-left corner into the case. World space.
 */
const NET_ON_DESK = 0.0065;
export const ETHERNET_POINTS: Vector3[] = [
  serverToWorld(new Vector3(0.03, 0.02, -MINI_SERVER.depth / 2 - 0.002)),
  serverToWorld(new Vector3(0.035, 0.012, -MINI_SERVER.depth / 2 - 0.03)),
  serverToWorld(new Vector3(0.04, NET_ON_DESK, -MINI_SERVER.depth / 2 - 0.06)),
  new Vector3(0.36, NET_ON_DESK, -0.35),
  new Vector3(0.44, NET_ON_DESK, -0.39),
  towerToWorld(new Vector3(-0.165, NET_ON_DESK / TOWER.scale, -0.165)),
  towerToWorld(new Vector3(-0.165, 0.025, -0.165)),
  towerToWorld(new Vector3(-0.165, 0.12, -0.165)),
  towerToWorld(new Vector3(-0.15, 0.3, -0.15)),
];

export function createEthernetCurve(): CatmullRomCurve3 {
  return new CatmullRomCurve3(ETHERNET_POINTS, false, "catmullrom", 0.2);
}
