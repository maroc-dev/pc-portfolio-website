import type { Camera, Material, Mesh, Scene, Texture, WebGLRenderer } from "three";
import { introReady } from "./readiness";

/** The opening never starts sooner than this after the scene mounts: a beat to settle in. */
export const INTRO_MIN_WAIT_MS = 1500;
/** Longest the opening waits for slow setup work before going ahead anyway. */
const READY_TIMEOUT_MS = 3000;
/** Off-screen frames of the finished scene: shadow maps, effect passes and uploads warm up. */
const WARM_UP_FRAMES = 4;
const FADE = "opacity 0.6s ease";

/** Resolves after `count` animation frames (R3F renders on each one). */
export function nextFrames(count: number): Promise<void> {
  return new Promise((resolve) => {
    let seen = 0;
    const tick = () => (++seen >= count ? resolve() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
  });
}

/** Sends every texture in the scene to the GPU now rather than the first time it's drawn. */
function uploadTextures(gl: WebGLRenderer, scene: Scene) {
  const seen = new Set<Texture>();
  scene.traverse((object) => {
    const material = (object as Mesh).material as Material | Material[] | undefined;
    if (!material) return;
    for (const m of Array.isArray(material) ? material : [material]) {
      for (const value of Object.values(m)) {
        if ((value as Texture | null)?.isTexture && !seen.has(value as Texture)) {
          seen.add(value as Texture);
          gl.initTexture(value as Texture);
        }
      }
    }
  });
}

/**
 * Gets everything ready before the opening plays, with the finished scene in place (hidden
 * objects are skipped by the compiler): waits for held setup work such as fonts and the desk
 * grain, uploads every texture, compiles every shader, then renders a few frames off-screen so
 * nothing is drawn for the first time mid-animation.
 */
export async function prepareIntro(gl: WebGLRenderer, scene: Scene, camera: Camera) {
  const started = performance.now();
  await introReady(READY_TIMEOUT_MS);
  uploadTextures(gl, scene);
  try {
    await gl.compileAsync(scene, camera);
  } catch {
    // Compiling ahead is an optimisation; the warm-up frames compile anything left over.
  }
  await nextFrames(WARM_UP_FRAMES);
  const remaining = INTRO_MIN_WAIT_MS - (performance.now() - started);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
}

/** Keeps the scene out of sight while the opening prepares. */
export function hideCanvas(canvas: HTMLCanvasElement) {
  canvas.style.transition = FADE;
  canvas.style.opacity = "0";
}

export function revealCanvas(canvas: HTMLCanvasElement) {
  canvas.style.transition = FADE;
  canvas.style.opacity = "1";
}
