"use client";

import { useEffect } from "react";
import { experienceStore, type Theme } from "./experience-store";

export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before first paint (inlined in <head>) so the page never flashes the wrong theme.
 * Kept as a string because it executes outside the React bundle.
 */
export const THEME_BOOTSTRAP = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="night"?"night":"day"}catch(e){document.documentElement.dataset.theme="day"}`;

function isTheme(value: unknown): value is Theme {
  return value === "day" || value === "night";
}

/** Keeps the store, `<html data-theme>` and the visitor's saved choice in step. */
export function useThemeSync(): void {
  useEffect(() => {
    const initial = document.documentElement.dataset.theme;
    if (isTheme(initial)) experienceStore.getState().setTheme(initial);

    return experienceStore.subscribe((state, prev) => {
      if (state.theme === prev.theme) return;
      document.documentElement.dataset.theme = state.theme;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, state.theme);
      } catch {
        // Storage can be unavailable (private mode); the theme still applies for this visit.
      }
    });
  }, []);
}
