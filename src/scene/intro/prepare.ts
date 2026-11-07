import type { Camera, Scene, WebGLRenderer } from "three";
import { introReady } from "./readiness";

/** The opening never starts sooner than this after the scene mounts: a beat to settle in. */
export const INTRO_MIN_WAIT_MS = 1500;
/** Longest the opening waits for slow setup work before going ahead anyway. */
const READY_TIMEOUT_MS = 2500;
const FADE = "opacity 0.6s ease";

/**
 * Gets the scene ready before the opening plays: compiles every shader up front (while all the
 * pieces are still in place, since hidden objects are skipped), waits for held setup work like
 * the desk grain, and leaves a short beat so the animation starts cleanly rather than mid-load.
 */
export async function prepareIntro(gl: WebGLRenderer, scene: Scene, camera: Camera) {
  const started = performance.now();
  try {
    await gl.compileAsync(scene, camera);
  } catch {
    // Compiling ahead is an optimisation; the first frames compile anything left over.
  }
  await introReady(READY_TIMEOUT_MS);
  const remaining = INTRO_MIN_WAIT_MS - (performance.now() - started);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
}

/** Keeps the finished scene out of sight while the opening prepares. */
export function hideCanvas(canvas: HTMLCanvasElement) {
  canvas.style.transition = FADE;
  canvas.style.opacity = "0";
}

export function revealCanvas(canvas: HTMLCanvasElement) {
  canvas.style.transition = FADE;
  canvas.style.opacity = "1";
}
