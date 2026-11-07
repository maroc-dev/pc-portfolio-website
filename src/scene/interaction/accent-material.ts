import { Color, MeshStandardMaterial, type ColorRepresentation } from "three";

/**
 * A part's own glowing material (not shared), so its highlight never leaks to other parts.
 * Not tone mapped: LEDs should stay saturated rather than wash out to white.
 */
export function createAccentMaterial(color: ColorRepresentation): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: "#111010",
    emissive: new Color(color),
    emissiveIntensity: 0,
    roughness: 0.4,
    metalness: 0,
    toneMapped: false,
  });
}
