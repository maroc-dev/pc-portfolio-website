import gsap from "gsap";
import type { PartId } from "@/content/types";
import { duration, ease } from "@/lib/motion/tokens";
import type { CameraPose } from "../camera-presets";
import { runtime } from "../runtime";

/** Tweens `pose` towards `to` on `tl` at `at` seconds. */
function moveTo(
  tl: gsap.core.Timeline,
  pose: CameraPose,
  to: CameraPose,
  at: number,
  seconds: number,
  curve: string,
) {
  const tween = { duration: seconds, ease: curve };
  tl.to(pose.position, { x: to.position.x, y: to.position.y, z: to.position.z, ...tween }, at);
  tl.to(pose.target, { x: to.target.x, y: to.target.y, z: to.target.z, ...tween }, at);
  tl.to(pose, { fov: to.fov, ...tween }, at);
}

export function snapTo(pose: CameraPose, to: CameraPose) {
  pose.position.copy(to.position);
  pose.target.copy(to.target);
  pose.fov = to.fov;
}

interface SelectionArgs {
  pose: CameraPose;
  part: PartId;
  /** True when switching from another open part: skip the close-up. */
  switching: boolean;
  closeUp: CameraPose;
  monitor: CameraPose;
  /** Called when the window should appear (slightly before the camera settles). */
  onArrive: () => void;
}

/**
 * The part glows and the camera visits it, a signal runs down the cable, then the camera settles
 * on the monitor where the content opens. One timeline, so it can be killed as a unit.
 */
export function selectionTimeline({
  pose,
  part,
  switching,
  closeUp,
  monitor,
  onArrive,
}: SelectionArgs) {
  const tl = gsap.timeline();
  tl.set(runtime, { signal: 0 }, 0);

  if (switching) {
    moveTo(tl, pose, monitor, 0, 0.6, ease.arrive);
    tl.to(runtime, { signal: 1, duration: 0.7, ease: "none" }, 0);
    tl.call(onArrive, [], 0);
    return tl;
  }

  moveTo(tl, pose, closeUp, 0, duration.beat, ease.travel);
  if (part === "gpu") {
    tl.to(runtime, { gpuBoost: 1, duration: 0.35, ease: ease.arrive }, 0.25);
    tl.to(runtime, { gpuBoost: 0, duration: 0.8, ease: ease.leave }, 0.9);
  }
  const leave = duration.beat + 0.15;
  tl.to(runtime, { signal: 1, duration: 0.9, ease: "none" }, leave - 0.4);
  moveTo(tl, pose, monitor, leave, duration.toMonitor, ease.arrive);
  tl.call(onArrive, [], leave + duration.toMonitor * 0.7);
  return tl;
}

export function overviewTimeline(pose: CameraPose, overview: CameraPose) {
  const tl = gsap.timeline();
  tl.set(runtime, { signal: 0, gpuBoost: 0 }, 0);
  moveTo(tl, pose, overview, 0, duration.toOverview, ease.travel);
  return tl;
}

/** Power-on: LEDs and fans ramp up while the camera eases in from slightly further back. */
export function bootTimeline(pose: CameraPose, overview: CameraPose, onDone: () => void) {
  const tl = gsap.timeline({ onComplete: onDone });
  tl.set(runtime, { power: 0 }, 0);
  tl.to(runtime, { power: 1, duration: 1.1, ease: "power2.inOut" }, 0.2);
  moveTo(tl, pose, overview, 0, duration.boot, ease.arrive);
  return tl;
}
