import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import { MathUtils, Vector2, Vector3, type PerspectiveCamera } from "three";
import type { PartId } from "@/content/types";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore } from "@/state/experience-store";
import { monitorPose, overviewPose, partPose, type CameraPose } from "../camera-presets";
import { runtime } from "../runtime";
import { bootTimeline, overviewTimeline, selectionTimeline, snapTo } from "./timelines";

/** How far the camera starts behind the overview during power-on. */
const BOOT_PULLBACK = 1.18;
/** Pointer parallax strength in metres (overview only). */
const PARALLAX = new Vector2(0.05, 0.03);

function restPose(selected: PartId | null, aspect: number): CameraPose {
  return selected ? monitorPose(aspect) : overviewPose(aspect);
}

/**
 * Owns the camera. GSAP timelines animate a plain `pose` object; this component applies it to
 * the camera every frame (plus parallax). Starting a new move kills the running timeline and
 * continues from wherever the camera is, so interruptions never jump.
 */
export function CameraRig() {
  const get = useThree((s) => s.get);
  const invalidate = useThree((s) => s.invalidate);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const aspectRef = useRef(aspect);
  const pose = useRef<CameraPose>({ position: new Vector3(), target: new Vector3(), fov: 32 });
  const active = useRef<gsap.core.Timeline | null>(null);
  const boot = useRef<gsap.core.Timeline | null>(null);
  const parallax = useRef(new Vector2());

  // Initial placement and power-on.
  useLayoutEffect(() => {
    const store = experienceStore.getState();
    const a = aspectRef.current;
    const finish = () => {
      runtime.power = 1;
      experienceStore.getState().finishBoot();
    };

    if (store.selected) {
      // Deep link: start at the monitor with the window already open.
      snapTo(pose.current, monitorPose(a));
      store.revealWindow();
      finish();
    } else if (prefersReducedMotion() || store.phase !== "boot") {
      snapTo(pose.current, overviewPose(a));
      finish();
    } else {
      const overview = overviewPose(a);
      const start = overview.target
        .clone()
        .add(overview.position.clone().sub(overview.target).multiplyScalar(BOOT_PULLBACK));
      snapTo(pose.current, { ...overview, position: start });
      boot.current = bootTimeline(pose.current, overview, finish);
    }
    invalidate();
    return () => {
      boot.current?.kill();
      active.current?.kill();
    };
  }, [invalidate]);

  // React to selection changes and boot skips.
  useEffect(
    () =>
      experienceStore.subscribe((state, prev) => {
        const skippedBoot = prev.phase === "boot" && state.phase !== "boot";
        if ((skippedBoot || state.selected !== prev.selected) && boot.current) {
          boot.current.progress(1);
          boot.current = null;
        }
        if (state.selected === prev.selected) return;

        active.current?.kill();
        const a = aspectRef.current;

        if (prefersReducedMotion()) {
          snapTo(pose.current, restPose(state.selected, a));
          runtime.signal = 0;
          if (state.selected) experienceStore.getState().revealWindow();
          invalidate();
          return;
        }

        active.current = state.selected
          ? selectionTimeline({
              pose: pose.current,
              part: state.selected,
              switching: prev.selected !== null,
              closeUp: partPose(state.selected, a),
              monitor: monitorPose(a),
              onArrive: () => experienceStore.getState().revealWindow(),
            })
          : overviewTimeline(pose.current, overviewPose(a));
      }),
    [invalidate],
  );

  // Re-frame on resize when nothing is animating.
  useEffect(() => {
    aspectRef.current = aspect;
    if (active.current?.isActive() || boot.current?.isActive()) return;
    snapTo(pose.current, restPose(experienceStore.getState().selected, aspect));
    invalidate();
  }, [aspect, invalidate]);

  useFrame((state, delta) => {
    const camera = get().camera as PerspectiveCamera;
    const allowParallax =
      experienceStore.getState().phase === "overview" && !prefersReducedMotion();
    const tx = allowParallax ? state.pointer.x : 0;
    const ty = allowParallax ? state.pointer.y : 0;
    parallax.current.x = MathUtils.damp(parallax.current.x, tx, 3, delta);
    parallax.current.y = MathUtils.damp(parallax.current.y, ty, 3, delta);

    const p = pose.current;
    camera.position.copy(p.position);
    camera.position.x += parallax.current.x * PARALLAX.x;
    camera.position.y += parallax.current.y * PARALLAX.y;
    camera.lookAt(p.target);
    if (Math.abs(camera.fov - p.fov) > 1e-4) {
      camera.fov = p.fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
