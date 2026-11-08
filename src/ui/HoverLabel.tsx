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
        <div className="border-line bg-panel max-w-72 rounded-lg border px-4 pt-3 pb-3.5 shadow-[0_12px_30px_-14px_rgb(19_35_74/0.45)]">
          <p className="flex items-center gap-2">
            <span className="tape text-xs">{part.label}</span>
            <span className="type-meta text-muted text-[0.8125rem]">{part.hardwareName}</span>
          </p>
          <p className="type-display mt-2.5 text-lg">{part.heading}</p>
          <p className="text-muted mt-1 text-sm leading-snug">{part.blurb}</p>
        </div>
      )}
    </div>
  );
}
