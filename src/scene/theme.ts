import { Color } from "three";

/** Scene values for each theme. Anything themed blends between these by `runtime.daylight`. */
export const SCENE_THEME = {
  day: {
    background: new Color("#dcebfb"),
    wall: new Color("#e3eefc"),
    hemiSky: new Color("#f2f8ff"),
    hemiGround: new Color("#e2c9a6"),
    hemiIntensity: 1.8,
    sun: new Color("#fff3df"),
    sunIntensity: 3.6,
    environment: 1.2,
    contactShadow: new Color("#2b3a55"),
  },
  night: {
    background: new Color("#0e1626"),
    wall: new Color("#1c2a47"),
    hemiSky: new Color("#3d5487"),
    hemiGround: new Color("#0e0c0a"),
    hemiIntensity: 0.4,
    sun: new Color("#8fb0ff"),
    sunIntensity: 0.45,
    environment: 0.35,
    contactShadow: new Color("#05070c"),
  },
} as const;

/** Writes the blend of `night` and `day` at `t` (0 = night, 1 = day) into `target`. */
export function blend(target: Color, night: Color, day: Color, t: number): Color {
  return target.copy(night).lerp(day, t);
}

export function mix(night: number, day: number, t: number): number {
  return night + (day - night) * t;
}
