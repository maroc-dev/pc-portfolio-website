"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { getPart } from "@/content/parts";
import type { PartId } from "@/content/types";
import { COMPACT_QUERY, useMediaQuery } from "@/lib/dom/use-media-query";
import { duration, ease } from "@/lib/motion/tokens";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { experienceStore, useExperience, type ScreenRect } from "@/state/experience-store";
import { pressedBeforeFullscreenExit } from "@/state/use-fullscreen-sync";
import { SectionView } from "./sections/SectionView";

/** Window placement: on the monitor's screen when known, otherwise centred. */
function placement(rect: ScreenRect | null): CSSProperties {
  if (!rect) {
    return { inset: 0, margin: "auto", width: "min(880px, 92vw)", height: "min(620px, 76vh)" };
  }
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

/** Four corners pointing out (enter full view) or in (leave it). */
function FullViewIcon({ exit }: { exit: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d={
          exit
            ? "M6 1.5V6H1.5M10 1.5V6h4.5M6 14.5V10H1.5M10 14.5V10h4.5"
            : "M1.5 6V1.5H6M14.5 6V1.5H10M1.5 10v4.5H6M14.5 10v4.5H10"
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The content "app" that opens on the monitor. On desktop it sits exactly over the projected
 * screen; on phones it becomes a full-height sheet styled like the same window. "Full screen"
 * moves the camera in until the monitor fills the viewport, and the window grows with it.
 */
export function ScreenWindow() {
  const selected = useExperience((s) => s.selected);
  const open = useExperience((s) => s.windowOpen);
  const rect = useExperience((s) => s.screenRect);
  const compact = useMediaQuery(COMPACT_QUERY);
  const fullView = useExperience((s) => s.fullView);

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

  // Phones already show the section as a full-height sheet.
  useEffect(() => {
    if (compact) experienceStore.getState().setFullView(false);
  }, [compact]);

  useEffect(() => {
    if (!open) return;
    // Esc steps out one level: full view first, then back to the desk.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const store = experienceStore.getState();
      if (store.fullView) store.setFullView(false);
      else if (!pressedBeforeFullscreenExit(e.timeStamp)) store.back();
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
          ? "border-line bg-panel fixed inset-x-0 top-[8svh] bottom-0 z-50 flex flex-col overflow-hidden rounded-t-[14px] border shadow-[0_-12px_40px_rgb(13_22_40/0.45)]"
          : "bg-panel absolute z-20 flex flex-col overflow-hidden rounded-[3px]"
      }
    >
      <div className="border-line flex h-11 shrink-0 items-center justify-between gap-3 border-b px-3 md:px-4">
        <p className="flex min-w-0 items-center gap-2.5">
          <span className="tape text-xs">{part.label}</span>
          <span className="type-meta text-muted truncate text-sm">{part.appName}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {!compact && (
            <button
              type="button"
              aria-pressed={fullView}
              onClick={() => experienceStore.getState().setFullView(!fullView)}
              className="text-muted hover:text-fg aria-pressed:bg-base aria-pressed:text-fg flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors"
            >
              <FullViewIcon exit={fullView} />
              Full screen
            </button>
          )}
          <button
            type="button"
            onClick={() => experienceStore.getState().back()}
            className="border-line text-muted hover:text-fg hover:border-powder rounded-md border px-2.5 py-1 text-sm transition-colors"
          >
            Back to the desk
          </button>
        </div>
      </div>
      <div
        ref={body}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-7 md:px-10 md:py-9"
      >
        {/* In full view the window is wide, so keep a readable column centred in it. */}
        <div className={fullView ? "mx-auto max-w-[60rem]" : undefined}>
          <h2
            ref={heading}
            id={titleId}
            tabIndex={-1}
            className="type-display text-[2.25rem] outline-none md:text-[3rem]"
          >
            {part.heading}
          </h2>
          <p className="text-muted mt-3 mb-9 max-w-[52ch] text-lg leading-snug">{part.blurb}</p>
          <SectionView section={part.section} />
        </div>
      </div>
    </div>
  );
}
