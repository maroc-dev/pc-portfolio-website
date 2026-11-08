import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Vector3 } from "three";
import { PART_IDS } from "@/content/types";
import { experienceStore } from "@/state/experience-store";
import { tagPositions } from "@/state/tag-positions";
import { PART_FOCUS } from "./layout";

const scratch = new Vector3();

/** Projects each part's tag point (just in front of the part) for the interface's part tags. */
export function TagAnchors() {
  const anchors = useMemo(
    () =>
      PART_IDS.map((id) => ({
        id,
        point: PART_FOCUS[id].center.clone().addScaledVector(PART_FOCUS[id].facing, 0.12),
      })),
    [],
  );

  useFrame(({ camera, size }) => {
    if (!experienceStore.getState().pcHovered) return;
    for (const { id, point } of anchors) {
      scratch.copy(point).project(camera);
      tagPositions.set(id, {
        x: ((scratch.x + 1) / 2) * size.width,
        y: ((1 - scratch.y) / 2) * size.height,
      });
    }
  });

  return null;
}
