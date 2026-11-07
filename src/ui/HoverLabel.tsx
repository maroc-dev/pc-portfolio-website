"use client";

import { useEffect, useRef, useState } from "react";
import { getPart } from "@/content/parts";
import { COMPACT_QUERY, useMediaQuery } from "@/lib/dom/use-media-query";
import { useExperience } from "@/state/experience-store";

/**
 * Small label that follows the pointer while it rests on a part in the 3D scene.
 * Position updates go straight to the DOM so moving the mouse never re-renders React.
 */
export function HoverLabel() {
  const hovered = useExperience((s) => s.hovered);
  const compact = useMediaQuery(COMPACT_QUERY);
  const label = useRef<HTMLDivElement>(null);
  const [overScene, setOverScene] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setOverScene(e.target instanceof HTMLCanvasElement);
      if (label.current) {
        label.current.style.transform = `translate3d(${e.clientX + 18}px, ${e.clientY + 20}px, 0)`;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const part = hovered ? getPart(hovered) : null;
  const visible = Boolean(part) && overScene && !compact;

  return (
    <div
      ref={label}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 transition-opacity duration-150"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {part && (
        <div className="border-line bg-night/90 max-w-64 rounded-xl border px-3.5 py-2.5 backdrop-blur-sm">
          <p className="text-dust text-xs">
            <span className="text-amber type-mono mr-1.5">{part.label}</span>
            {part.hardwareName}
          </p>
          <p className="type-casual mt-0.5 font-bold">{part.heading}</p>
          <p className="text-dust mt-0.5 text-sm">{part.blurb}</p>
        </div>
      )}
    </div>
  );
}
