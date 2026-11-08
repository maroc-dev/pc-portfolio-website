"use client";

import { useEffect } from "react";
import { experienceStore } from "./experience-store";

/** When the browser last left full screen, so the Esc that did it isn't handled twice. */
let leftFullscreenAt = Number.NEGATIVE_INFINITY;

/**
 * True for a key press that happened before the browser last left full screen. Some browsers
 * deliver the Esc that exits full screen to the page afterwards; that press has done its job.
 * `eventTime` is the event's `timeStamp`, on the same clock as `performance.now()`.
 */
export function pressedBeforeFullscreenExit(eventTime: number): boolean {
  return eventTime <= leftFullscreenAt;
}

/**
 * Full view also asks the browser for real full screen where it can. The zoom works without it
 * (the request can be refused), and leaving browser full screen (Esc, F11) leaves full view.
 */
export function useFullscreenSync(): void {
  useEffect(() => {
    const root = document.documentElement;

    // Runs inside the click that toggled full view, so the browser treats it as user-initiated.
    const unsubscribe = experienceStore.subscribe((state, prev) => {
      if (state.fullView === prev.fullView) return;
      if (state.fullView && !document.fullscreenElement && root.requestFullscreen) {
        root.requestFullscreen().catch(() => undefined);
      } else if (!state.fullView && document.fullscreenElement) {
        document.exitFullscreen().catch(() => undefined);
      }
    });

    const onChange = () => {
      if (document.fullscreenElement) return;
      leftFullscreenAt = performance.now();
      experienceStore.getState().setFullView(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      unsubscribe();
      document.removeEventListener("fullscreenchange", onChange);
    };
  }, []);
}
