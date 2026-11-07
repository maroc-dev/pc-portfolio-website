"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Phones and touch-first devices get the sheet layout and no hover labels. */
export const COMPACT_QUERY = "(max-width: 767px), (pointer: coarse)";

/** Live media query match. Returns `false` while prerendering. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
