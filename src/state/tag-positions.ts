import type { PartId } from "@/content/types";

/**
 * Where each part sits on screen, in canvas pixels. The scene writes it every frame while the
 * PC is hovered; the interface reads it in its own animation frame to place part tags. A plain
 * mutable map, not store state, so per-frame updates never trigger React renders.
 */
export const tagPositions = new Map<PartId, { x: number; y: number }>();
