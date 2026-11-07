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
  night: new Color("#1d1b19"),
  amber: new Color("#f2a65a"),
  teal: new Color("#5fb3a8"),
  cream: new Color("#f3e9dc"),
  lamp: new Color("#ffb36b"),
};

export const materials = {
  caseMetal: standard({ color: "#2b2826", metalness: 0.6, roughness: 0.45 }),
  caseInner: standard({ color: "#1c1a19", metalness: 0.3, roughness: 0.75 }),
  aluminium: standard({ color: "#b9b2a8", metalness: 0.85, roughness: 0.32 }),
  darkPlastic: standard({ color: "#1a1918", metalness: 0.1, roughness: 0.6 }),
  rubber: standard({ color: "#121110", metalness: 0, roughness: 0.9 }),
  walnut: standard({ color: "#6b4a33", metalness: 0, roughness: 0.55 }),
  wall: standard({ color: "#2b2622", metalness: 0, roughness: 0.95 }),
  felt: standard({ color: "#2e2a27", metalness: 0, roughness: 1 }),
  pcb: standard({ color: "#18231f", metalness: 0.2, roughness: 0.6 }),
  copper: standard({ color: "#b87333", metalness: 1, roughness: 0.35 }),
  gold: standard({ color: "#d4a64a", metalness: 1, roughness: 0.3 }),
  keycap: standard({ color: "#2a2724", metalness: 0, roughness: 0.7 }),
  glass: new MeshPhysicalMaterial({
    color: "#cfdcd8",
    metalness: 0,
    roughness: 0.04,
    transparent: true,
    opacity: 0.12,
    clearcoat: 1,
    depthWrite: false,
  }),
  /** Steady LEDs that only follow the power-on ramp (fan rings, strips). */
  ledAmber: new MeshBasicMaterial({ color: palette.amber.clone(), toneMapped: false }),
  ledTeal: new MeshBasicMaterial({ color: palette.teal.clone(), toneMapped: false }),
  bulb: new MeshBasicMaterial({ color: "#ffd9a8", toneMapped: false }),
};
