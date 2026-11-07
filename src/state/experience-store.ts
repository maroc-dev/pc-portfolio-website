import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import type { PartId } from "@/content/types";

/**
 * The only bridge between the 3D scene and the DOM interface.
 *
 * - The UI (dock, nav, URL) calls `select` / `back`.
 * - The scene's camera rig reacts to `selected`, animates, then calls `revealWindow` once the
 *   camera has arrived at the monitor. When no scene is running, `select` reveals immediately.
 */

export type Phase = "boot" | "overview" | "focused";
export type QualityTier = "high" | "low";
export type SceneStatus = "pending" | "ready" | "unavailable";

export interface ScreenRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ExperienceState {
  phase: Phase;
  hovered: PartId | null;
  selected: PartId | null;
  /** Content window visible. Stays open while switching between parts. */
  windowOpen: boolean;
  /** Monitor screen projected into viewport pixels, used to place the window. */
  screenRect: ScreenRect | null;
  scene: SceneStatus;
  quality: QualityTier;
}

export interface ExperienceActions {
  finishBoot: () => void;
  hover: (id: PartId | null) => void;
  select: (id: PartId) => void;
  back: () => void;
  revealWindow: () => void;
  setScreenRect: (rect: ScreenRect | null) => void;
  setScene: (status: SceneStatus) => void;
  setQuality: (tier: QualityTier) => void;
}

export type ExperienceStore = ExperienceState & ExperienceActions;

export const initialState: ExperienceState = {
  phase: "boot",
  hovered: null,
  selected: null,
  windowOpen: false,
  screenRect: null,
  scene: "pending",
  quality: "high",
};

export function createExperienceStore(initial: Partial<ExperienceState> = {}) {
  return createStore<ExperienceStore>()((set, get) => ({
    ...initialState,
    ...initial,

    finishBoot: () => {
      if (get().phase === "boot") set({ phase: "overview" });
    },

    hover: (id) => {
      if (get().hovered !== id) set({ hovered: id });
    },

    select: (id) => {
      const { selected, windowOpen, scene } = get();
      if (selected === id) return;
      set({
        phase: "focused",
        selected: id,
        hovered: null,
        // Keep an open window open (content swaps in place). Without a scene there is no
        // camera to wait for, so open straight away.
        windowOpen: windowOpen || scene !== "ready",
      });
    },

    back: () => {
      if (get().selected === null) return;
      set({ phase: "overview", selected: null, windowOpen: false });
    },

    revealWindow: () => {
      if (get().selected !== null && !get().windowOpen) set({ windowOpen: true });
    },

    setScreenRect: (rect) => set({ screenRect: rect }),
    setScene: (status) => set({ scene: status }),
    setQuality: (tier) => set({ quality: tier }),
  }));
}

/** App-wide singleton. Tests create their own with `createExperienceStore`. */
export const experienceStore = createExperienceStore();

export function useExperience<T>(selector: (state: ExperienceStore) => T): T {
  return useStore(experienceStore, selector);
}
