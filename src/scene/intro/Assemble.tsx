import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import { runtime } from "../runtime";
import type { Step } from "./schedule";

/** Quartic ease-out: quick to move, gentle to settle, no overshoot. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Slides its children into place during their step of the opening sequence. Hidden until the
 * step starts; at rest (no offset) whenever the sequence isn't running.
 */
export function Assemble({ step, children }: { step: Step; children: ReactNode }) {
  const group = useRef<Group>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const t = Math.min(1, Math.max(0, (runtime.assembly - step.at) / step.duration));
    const remaining = 1 - easeOut(t);
    g.visible = runtime.assembly > step.at;
    g.position.set(step.from[0] * remaining, step.from[1] * remaining, step.from[2] * remaining);
  });

  return <group ref={group}>{children}</group>;
}
