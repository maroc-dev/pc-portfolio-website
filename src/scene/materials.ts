import {
  Color,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type MeshStandardMaterialParameters,
} from "three";

/**
 * Shared materials for static surfaces. Created once and reused across meshes so the GPU sees
 * a handful of programs instead of one per mesh. They live as long as the page, so they are
 * never disposed. Parts that animate their own glow create their own material instead.
 */
const standard = (params: MeshStandardMaterialParameters) => new MeshStandardMaterial(params);

export const palette = {
  /** Friendly blue LED glow (fan rings, strips, part accents). */
  glow: new Color("#5aa9ff"),
  /** Cyan for data activity (network, storage). */
  signal: new Color("#4fd8e6"),
  /** Warm incandescent desk lamp, the one warm light at night. */
  lamp: new Color("#ffc58a"),
};

export const materials = {
  caseMetal: standard({ color: "#3a4150", metalness: 0.55, roughness: 0.45 }),
  /** Marco's case: powder-blue painted steel, with white interior trim. */
  casePowder: standard({ color: "#a9c0ea", metalness: 0.12, roughness: 0.5 }),
  caseWhite: standard({ color: "#eef1f6", metalness: 0.08, roughness: 0.55 }),
  caseInner: standard({ color: "#252b38", metalness: 0.3, roughness: 0.7 }),
  aluminium: standard({ color: "#c7ccd4", metalness: 0.85, roughness: 0.3 }),
  darkPlastic: standard({ color: "#20242d", metalness: 0.1, roughness: 0.6 }),
  rubber: standard({ color: "#16191f", metalness: 0, roughness: 0.85 }),
  /** Wall colour is themed per frame (see Room). */
  wall: standard({ color: "#d7e6f7", metalness: 0, roughness: 0.92 }),
  /** Navy felt desk mat. */
  felt: standard({ color: "#2f4b7c", metalness: 0, roughness: 1 }),
  paint: standard({ color: "#f4f6f9", metalness: 0, roughness: 0.6 }),
  pcb: standard({ color: "#18231f", metalness: 0.2, roughness: 0.6 }),
  copper: standard({ color: "#b87333", metalness: 1, roughness: 0.35 }),
  gold: standard({ color: "#d4a64a", metalness: 1, roughness: 0.3 }),
  keycap: standard({ color: "#f5f7fb", metalness: 0, roughness: 0.55 }),
  glass: new MeshPhysicalMaterial({
    color: "#dce8f5",
    metalness: 0,
    roughness: 0.04,
    transparent: true,
    opacity: 0.1,
    clearcoat: 1,
    depthWrite: false,
  }),
  /** Steady LEDs that only follow the power-on ramp (fan rings, strips). */
  ledGlow: new MeshBasicMaterial({ color: palette.glow.clone(), toneMapped: false }),
  ledSignal: new MeshBasicMaterial({ color: palette.signal.clone(), toneMapped: false }),
};
