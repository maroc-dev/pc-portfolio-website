/**
 * Per-frame values shared inside the scene. Animated by GSAP timelines and read in `useFrame`,
 * so they never trigger React renders. Not app state: the UI never reads these.
 */
export const runtime = {
  /**
   * 0 → 1 during power-on. Scales LEDs, fan speed and interior light. Starts on so the machine
   * is complete if the boot sequence never runs (reduced motion, deep links).
   */
  power: 1,
  /** 0 → 1 as a pulse travels along the cable to the monitor. */
  signal: 0,
  /** Extra fan speed multiplier, e.g. the GPU spin-up when selected. */
  gpuBoost: 0,
  /** 1 = day (sun through the window), 0 = night (lamp on). Tweened when the theme flips. */
  daylight: 1,
};
