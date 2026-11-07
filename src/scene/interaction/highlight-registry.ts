import type { Object3D } from "three";

/** How strongly a group is outlined: a soft hint, or the active part. */
export type HighlightLevel = "hint" | "strong";

const levels = new Map<Object3D, HighlightLevel>();
const listeners = new Set<() => void>();

export function setHighlight(group: Object3D, level: HighlightLevel | null): void {
  if (level === null ? !levels.has(group) : levels.get(group) === level) return;
  if (level === null) levels.delete(group);
  else levels.set(group, level);
  listeners.forEach((listener) => listener());
}

export function subscribeHighlights(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Meshes worth outlining under each highlighted group (skips hit areas and glass). */
export function highlightedMeshes(level: HighlightLevel): Object3D[] {
  const meshes: Object3D[] = [];
  for (const [group, l] of levels) {
    if (l !== level) continue;
    group.traverse((object) => {
      if ((object as { isMesh?: boolean }).isMesh && !object.userData.noOutline)
        meshes.push(object);
    });
  }
  return meshes;
}
