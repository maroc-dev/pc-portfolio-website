"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

export interface JumpItem {
  /** Element id of the part to jump to. */
  id: string;
  label: string;
}

/** Where, as a share of the scroll area's height, a part counts as the one being read. */
const READING_LINE = 0.3;

/**
 * A table of contents that sticks to the top of a section window: one tape button per part,
 * with the part being read in yellow. Follows the window's scroll area (`data-scroll-root`).
 * It sticks within its parent, so render it as a child of the section's outermost element.
 */
export function JumpBar({
  label,
  items,
  className = "",
}: {
  label: string;
  items: JumpItem[];
  className?: string;
}) {
  const nav = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<string | undefined>(items[0]?.id);
  const ids = items.map((item) => item.id).join(" ");

  useEffect(() => {
    const scroller = nav.current?.closest<HTMLElement>("[data-scroll-root]");
    if (!scroller) return;
    const targets = ids.split(" ");
    let frame = 0;

    const update = () => {
      frame = 0;
      const view = scroller.getBoundingClientRect();
      const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      let reading = targets[0];
      for (const id of targets) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= view.top + view.height * READING_LINE) {
          reading = id;
        }
      }
      setCurrent(atEnd ? targets.at(-1) : reading);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return (
    <nav
      ref={nav}
      aria-label={label}
      className={`bg-panel border-line sticky -top-7 z-10 -mx-5 border-b px-5 py-3 md:-top-9 md:-mx-10 md:px-10 ${className}`}
    >
      <ul className="flex flex-wrap gap-2">
        {items.map(({ id, label: itemLabel }) => (
          <li key={id}>
            <button
              type="button"
              aria-current={current === id ? "true" : undefined}
              onClick={() =>
                document.getElementById(id)?.scrollIntoView({
                  behavior: prefersReducedMotion() ? "auto" : "smooth",
                  block: "start",
                })
              }
              className={`tape text-xs transition-[transform,background-color] duration-150 ${
                current === id ? "" : "tape-paper hover:bg-tape hover:-rotate-1"
              }`}
            >
              {itemLabel}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
