"use client";

import { useEffect } from "react";
import { experienceStore } from "./experience-store";
import { readPart, withPart } from "./url";

/**
 * Keeps `?part=` in sync with the selection so sections can be deep-linked and the browser's
 * back button closes the window. Uses the History API directly (rather than the router) so the
 * statically prerendered page never re-renders on the server for a selection change.
 */
export function useUrlSync(): void {
  useEffect(() => {
    const { select, back } = experienceStore.getState();

    const initial = readPart(window.location.search);
    if (initial) select(initial);

    // True when the current history entry was pushed by us, so closing can step back to it.
    let pushedEntry = false;
    let applyingPop = false;

    const onPopState = () => {
      applyingPop = true;
      const part = readPart(window.location.search);
      if (part) select(part);
      else back();
      pushedEntry = false;
      applyingPop = false;
    };

    const unsubscribe = experienceStore.subscribe((state, prev) => {
      if (state.selected === prev.selected || applyingPop) return;
      const href = withPart(window.location.href, state.selected);

      if (prev.selected === null) {
        window.history.pushState(null, "", href);
        pushedEntry = true;
      } else if (state.selected === null && pushedEntry) {
        pushedEntry = false;
        window.history.back();
      } else {
        window.history.replaceState(null, "", href);
      }
    });

    window.addEventListener("popstate", onPopState);
    return () => {
      unsubscribe();
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
}
