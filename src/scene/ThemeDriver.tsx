import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useLayoutEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore } from "@/state/experience-store";
import { runtime } from "./runtime";

/** Eases `runtime.daylight` towards the chosen theme, like light slowly changing in a room. */
export function ThemeDriver() {
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    runtime.daylight = experienceStore.getState().theme === "day" ? 1 : 0;
    invalidate();
  }, [invalidate]);

  useEffect(
    () =>
      experienceStore.subscribe((state, prev) => {
        if (state.theme === prev.theme) return;
        const daylight = state.theme === "day" ? 1 : 0;
        gsap.killTweensOf(runtime, "daylight");
        if (prefersReducedMotion()) {
          runtime.daylight = daylight;
          invalidate();
          return;
        }
        gsap.to(runtime, { daylight, duration: 1.2, ease: "power2.inOut", onUpdate: invalidate });
      }),
    [invalidate],
  );

  return null;
}
