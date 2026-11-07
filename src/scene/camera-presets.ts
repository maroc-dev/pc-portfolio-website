import { MathUtils, Vector3 } from "three";
import type { PartId } from "@/content/types";
import { MONITOR, PART_ANCHORS, glassNormal, towerToWorld } from "./layout";

export interface CameraPose {
  position: Vector3;
  target: Vector3;
  fov: number;
}

/** Describes a shot by what must be visible rather than by a fixed camera position. */
export interface Framing {
  target: Vector3;
  /** Unit vector from the target towards the camera. */
  direction: Vector3;
  /** World-space width and height that must fit in view. */
  width: number;
  height: number;
  fov: number;
}

/** Places the camera so `width` × `height` fits the viewport for the given aspect ratio. */
export function frame(
  { target, direction, width, height, fov }: Framing,
  aspect: number,
): CameraPose {
  const halfV = Math.tan(MathUtils.degToRad(fov) / 2);
  const distance = Math.max(height / 2 / halfV, width / 2 / (halfV * aspect));
  return {
    position: target.clone().addScaledVector(direction.clone().normalize(), distance),
    target: target.clone(),
    fov,
  };
}

const isPortrait = (aspect: number) => aspect < 1;

export function overviewPose(aspect: number): CameraPose {
  return frame(
    {
      target: new Vector3(isPortrait(aspect) ? 0.1 : 0.14, 0.27, -0.06),
      direction: new Vector3(-0.28, 0.34, 1),
      width: isPortrait(aspect) ? 1.75 : 1.95,
      height: 0.92,
      fov: isPortrait(aspect) ? 40 : 32,
    },
    aspect,
  );
}

export function partPose(part: PartId, aspect: number): CameraPose {
  const target = towerToWorld(PART_ANCHORS[part]);
  return frame(
    {
      target,
      direction: glassNormal.clone().add(new Vector3(0, 0.45, 0)),
      width: 0.34,
      height: 0.24,
      fov: 32,
    },
    aspect,
  );
}

/** Frames the monitor so its screen fills most of the viewport, leaving room for header and dock. */
export function monitorPose(aspect: number): CameraPose {
  const portrait = isPortrait(aspect);
  return frame(
    {
      target: MONITOR.screenCenter.clone(),
      direction: new Vector3(0, 0.04, 1),
      width: MONITOR.screenWidth / (portrait ? 0.96 : 0.62),
      height: MONITOR.screenHeight / 0.7,
      fov: 30,
    },
    aspect,
  );
}
