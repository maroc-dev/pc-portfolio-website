import { useCursor } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { MathUtils, type ColorRepresentation, type MeshStandardMaterial } from "three";
import type { PartId } from "@/content/types";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore, useExperience } from "@/state/experience-store";
import { runtime } from "../runtime";
import { createAccentMaterial } from "./accent-material";

/** A glowing material owned by a part. Its intensity follows hover/selection. */
export interface Accent {
  material: MeshStandardMaterial;
  /** Resting intensity; a function of time lets LEDs breathe or blink. */
  base: number | ((time: number) => number);
  /** Intensity when the part is hovered or selected. */
  peak: number;
}

/** Creates (and disposes) a part's own glowing material. `base` must be stable. */
export function usePartAccent(
  color: ColorRepresentation,
  base: Accent["base"],
  peak: number,
): Accent {
  const material = useMemo(() => createAccentMaterial(color), [color]);
  useEffect(() => () => material.dispose(), [material]);
  return useMemo(() => ({ material, base, peak }), [material, base, peak]);
}

/** Rate at which highlight eases towards its target (higher is snappier). */
const RESPONSE = 14;
/** How much non-selected parts dim while another part is selected. */
const DIM = 0.3;

/** Writes each accent's glow for this frame. Materials are three.js objects, mutated in place. */
function applyGlow(accents: readonly Accent[], level: number, dim: number, time: number) {
  for (const accent of accents) {
    const base = typeof accent.base === "function" ? accent.base(time) : accent.base;
    const value = MathUtils.lerp(base * dim, accent.peak, level);
    accent.material.emissiveIntensity = value * runtime.power;
  }
}

interface InteractiveProps {
  id: PartId;
  accents: Accent[];
  children: ReactNode;
}

/**
 * Makes a group of meshes behave as one selectable part: pointer events feed the store, and the
 * part's accent materials brighten on hover/selection and dim while another part is selected.
 */
export function Interactive({ id, accents, children }: InteractiveProps) {
  const level = useRef(0);
  const hovered = useExperience((s) => s.hovered === id);
  useCursor(hovered);

  useFrame(({ clock }, delta) => {
    const { hovered: h, selected } = experienceStore.getState();
    const target = h === id || selected === id ? 1 : 0;
    const reduced = prefersReducedMotion();
    level.current = reduced ? target : MathUtils.damp(level.current, target, RESPONSE, delta);
    const dim = selected && selected !== id ? DIM : 1;
    // Frozen time under reduced motion keeps breathing/blinking LEDs steady.
    const t = reduced ? 0 : clock.elapsedTime;

    applyGlow(accents, level.current, dim, t);
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    experienceStore.getState().hover(id);
  };
  const onOut = () => {
    if (experienceStore.getState().hovered === id) experienceStore.getState().hover(null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    experienceStore.getState().select(id);
  };

  return (
    <group name={id} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      {children}
    </group>
  );
}
