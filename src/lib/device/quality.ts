export type QualityTier = "high" | "low";

export interface DeviceHints {
  coarsePointer: boolean;
  viewportWidth: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;
}

/** Picks a starting render tier; the scene can still step down at runtime. */
export function pickQualityTier(hints: DeviceHints): QualityTier {
  if (hints.coarsePointer || hints.viewportWidth < 768) return "low";
  if (hints.hardwareConcurrency !== undefined && hints.hardwareConcurrency <= 4) return "low";
  if (hints.deviceMemory !== undefined && hints.deviceMemory < 4) return "low";
  return "high";
}

export function readDeviceHints(): DeviceHints {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    viewportWidth: window.innerWidth,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
  };
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
