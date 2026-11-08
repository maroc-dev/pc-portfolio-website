import { useFrame } from "@react-three/fiber";
import { materials, palette } from "./materials";
import { runtime } from "./runtime";

/** Shared LED materials (fan rings, light strips) follow the machine's power-on ramp. */
export function PowerLights() {
  useFrame(() => {
    const p = runtime.power;
    materials.ledGlow.color.copy(palette.glow).multiplyScalar(p);
    materials.ledSignal.color.copy(palette.signal).multiplyScalar(p);
  });
  return null;
}
