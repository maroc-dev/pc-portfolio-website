"use client";

import { useEffect, useRef } from "react";
import { parts } from "@/content/parts";
import type { PartId } from "@/content/types";
import { COMPACT_QUERY, useMediaQuery } from "@/lib/dom/use-media-query";
import { useExperience } from "@/state/experience-store";
import { tagPositions } from "@/state/tag-positions";
import { tapeTilt } from "@/lib/tape";

/**
 * While the pointer is over the PC, a strip of label tape names each selectable part. Decorative
 * (`aria-hidden`): the dock is the accessible list of the same parts.
 */
export function PartTags() {
  const visible = useExperience((s) => s.pcHovered && s.phase === "overview");
  const hovered = useExperience((s) => s.hovered);
  const compact = useMediaQuery(COMPACT_QUERY);
  const tags = useRef(new Map<PartId, HTMLSpanElement>());

  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const place = () => {
      for (const [id, el] of tags.current) {
        const p = tagPositions.get(id);
        if (p)
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${tapeTilt(id)}deg)`;
      }
      frame = requestAnimationFrame(place);
    };
    place();
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  if (compact) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {parts.map((part) => (
        <span
          key={part.id}
          ref={(el) => {
            if (el) tags.current.set(part.id, el);
            else tags.current.delete(part.id);
          }}
          className="tape absolute top-0 left-0 text-xs transition-opacity duration-200"
          style={{ opacity: visible && hovered !== part.id ? 1 : 0 }}
        >
          {part.label}
        </span>
      ))}
    </div>
  );
}
