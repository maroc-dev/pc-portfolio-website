import { useEffect, useRef, type ReactNode } from "react";
import type { Group } from "three";
import { setHighlight, type HighlightLevel } from "./highlight-registry";

interface HighlightProps {
  active: boolean;
  strength: HighlightLevel;
  children: ReactNode;
}

/** Outlines its children (via the post-processing outline pass) while `active`. */
export function Highlight({ active, strength, children }: HighlightProps) {
  const group = useRef<Group>(null);
  const level = active ? strength : null;

  useEffect(() => {
    const g = group.current;
    if (!g) return;
    setHighlight(g, level);
    return () => setHighlight(g, null);
  }, [level]);

  return <group ref={group}>{children}</group>;
}
