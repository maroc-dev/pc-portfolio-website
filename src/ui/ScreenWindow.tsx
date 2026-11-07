"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { getPart } from "@/content/parts";
import type { PartId } from "@/content/types";
import { COMPACT_QUERY, useMediaQuery } from "@/lib/dom/use-media-query";
import { duration, ease } from "@/lib/motion/tokens";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore, useExperience, type ScreenRect } from "@/state/experience-store";
import { SectionView } from "./sections/SectionView";

/** Window placement: on the monitor's screen when known, otherwise centred. */
function placement(rect: ScreenRect | null): CSSProperties {
  if (!rect) {
    return { inset: 0, margin: "auto", width: "min(880px, 92vw)", height: "min(620px, 76vh)" };
  }
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

/**
 * The content "app" that opens on the monitor. On desktop it sits exactly over the projected
 * screen; on phones it becomes a full-height sheet styled like the same window.
 */
export function ScreenWindow() {
  const selected = useExperience((s) => s.selected);
  const open = useExperience((s) => s.windowOpen);
  const rect = useExperience((s) => s.screenRect);
  const compact = useMediaQuery(COMPACT_QUERY);

  // The part on screen; lingers while the closing animation plays.
  const [shown, setShown] = useState<PartId | null>(null);
  if (open && selected && shown !== selected) setShown(selected);

  const panel = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const wasOpen = useRef(false);
  const returnFocus = useRef<Element | null>(null);

  // Open and close: the screen "switches on" from a horizontal line, or the sheet slides up.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    gsap.killTweensOf(el);

    if (open && !wasOpen.current) {
      wasOpen.current = true;
      returnFocus.current = document.activeElement;
      heading.current?.focus({ preventScroll: true });
      if (reduced) return;
      const from = compact ? { yPercent: 100 } : { clipPath: "inset(50% 0% 50% 0%)", opacity: 0.6 };
      const to = compact ? { yPercent: 0 } : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 };
      gsap.fromTo(el, from, {
        ...to,
        duration: duration.windowIn,
        ease: ease.arrive,
        clearProps: "clipPath,opacity,transform",
      });
    } else if (!open && wasOpen.current) {
      wasOpen.current = false;
      const done = () => {
        setShown(null);
        if (returnFocus.current instanceof HTMLElement) returnFocus.current.focus();
      };
      if (reduced) done();
      else
        gsap.to(el, {
          opacity: 0,
          duration: duration.windowOut,
          ease: ease.leave,
          onComplete: done,
        });
    }
  }, [open, compact, shown]);

  // Switching parts while open: cross-fade the content in place.
  useLayoutEffect(() => {
    if (!body.current || !wasOpen.current || prefersReducedMotion()) return;
    gsap.fromTo(
      body.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: ease.arrive },
    );
    body.current.scrollTop = 0;
  }, [shown]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") experienceStore.getState().back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!shown) return null;
  const part = getPart(shown);
  const titleId = `window-title-${part.id}`;

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      style={compact ? undefined : placement(rect)}
      className={
        compact
          ? "border-line bg-ink fixed inset-x-0 top-[8svh] bottom-0 z-50 flex flex-col overflow-hidden rounded-t-2xl border shadow-[0_-12px_40px_rgba(0,0,0,0.45)]"
          : "bg-ink absolute z-20 flex flex-col overflow-hidden rounded-[3px]"
      }
    >
      <div className="border-line flex h-10 shrink-0 items-center justify-between border-b px-4">
        <span className="text-dust type-mono text-xs">{part.appName}</span>
        <button
          type="button"
          onClick={() => experienceStore.getState().back()}
          className="text-dust hover:text-cream rounded-md px-2 py-1 text-sm transition-colors"
        >
          Back to the desk
        </button>
      </div>
      <div
        ref={body}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-8 md:py-7"
      >
        <p className="text-dust text-sm">
          <span className="text-amber type-mono mr-2">{part.label}</span>
          {part.topic}
        </p>
        <h2
          ref={heading}
          id={titleId}
          tabIndex={-1}
          className="mt-1 mb-6 text-3xl font-extrabold outline-none md:text-4xl"
        >
          {part.heading}
        </h2>
        <SectionView section={part.section} />
      </div>
    </div>
  );
}
