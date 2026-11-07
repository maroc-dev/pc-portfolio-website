import { useCursor } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { MathUtils, type MeshStandardMaterial } from "three";
import type { PartId } from "@/content/types";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore, useExperience } from "@/state/experience-store";
import { runtime } from "../runtime";

/** A glowing material owned by a part. Its intensity follows hover/selection. */
export interface Accent {
  material: MeshStandardMaterial;
  /** Resting intensity; a function lets LEDs breathe or blink. */
  base: number | ((time: number) => number);
  /** Intensity when the part is hovered or selected. */
  peak: number;
}

type Registry = { add: (accent: Accent) => () => void };
const AccentContext = createContext<Registry | null>(null);

/** Registers `accent` with the nearest Interactive part for the component's lifetime. */
export function useAccent(accent: Accent): void {
  const registry = useContext(AccentContext);
  useEffect(() => registry?.add(accent), [registry, accent]);
}

/** Rate at which highlight eases towards its target (higher is snappier). */
const RESPONSE = 14;
/** How much non-selected parts dim while another part is selected. */
const DIM = 0.3;

interface InteractiveProps {
  id: PartId;
  children: ReactNode;
}

/**
 * Makes a group of meshes behave as one selectable part: pointer events feed the store, and
 * registered accent materials brighten on hover/selection and dim when another part is chosen.
 */
export function Interactive({ id, children }: InteractiveProps) {
  const accents = useRef(new Set<Accent>());
  const level = useRef(0);
  const hovered = useExperience((s) => s.hovered === id);
  useCursor(hovered);

  const registry = useMemo<Registry>(
    () => ({
      add(accent) {
        accents.current.add(accent);
        return () => accents.current.delete(accent);
      },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const { hovered: h, selected } = experienceStore.getState();
    const target = h === id || selected === id ? 1 : 0;
    level.current = prefersReducedMotion()
      ? target
      : MathUtils.damp(level.current, target, RESPONSE, delta);
    const dim = selected && selected !== id ? DIM : 1;
    const t = clock.elapsedTime;

    for (const accent of accents.current) {
      const base = typeof accent.base === "function" ? accent.base(t) : accent.base;
      const value = MathUtils.lerp(base * dim, accent.peak, level.current);
      accent.material.emissiveIntensity = value * runtime.power;
    }
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
      <AccentContext.Provider value={registry}>{children}</AccentContext.Provider>
    </group>
  );
}
