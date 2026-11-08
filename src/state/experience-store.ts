import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import type { PartId } from "@/content/types";
import type { QualityTier } from "@/lib/device/quality";

/**
 * The only bridge between the 3D scene and the DOM interface.
 *
 * - The UI (dock, nav, URL) calls `select` / `back`.
 * - The scene's camera rig reacts to `selected`, animates, then calls `revealWindow` once the
 *   camera has arrived at the monitor. When no scene is running, `select` reveals immediately.
 */

export type Phase = "boot" | "overview" | "focused";
export type SceneStatus = "pending" | "ready" | "unavailable";
export type Theme = "day" | "night";

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
  /** Monitor screen projected into viewport pixels right now; follows every camera move. */
  screenRect: ScreenRect | null;
  /**
   * Where the screen sits in the normal monitor framing for this viewport. The window is laid
   * out at this size (like a monitor's fixed resolution) and only scaled to follow `screenRect`,
   * so camera moves never re-flow its text.
   */
  screenLayout: ScreenRect | null;
  scene: SceneStatus;
  quality: QualityTier;
  /** Day (sunlight through the window) or night (desk lamp on). */
  theme: Theme;
  /** Pointer is somewhere over the PC: outline every part as a hint. */
  pcHovered: boolean;
  /** The visitor has found a part at least once; first-visit hints can go. */
  explored: boolean;
  /** Full view: the camera moves in until the monitor's screen fills the viewport. */
  fullView: boolean;
  /** An element id the open section should scroll to (and expand) once it's showing. */
  anchor: string | null;
}

export interface ExperienceActions {
  finishBoot: () => void;
  hover: (id: PartId | null) => void;
  /** Opens a part's section, optionally at an element inside it. */
  select: (id: PartId, anchor?: string) => void;
  clearAnchor: () => void;
  back: () => void;
  revealWindow: () => void;
  setScreenRect: (rect: ScreenRect | null) => void;
  setScreenLayout: (rect: ScreenRect | null) => void;
  setScene: (status: SceneStatus) => void;
  setQuality: (tier: QualityTier) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setPcHovered: (hovered: boolean) => void;
  /** Enters or leaves full view. Only possible while a section is open. */
  setFullView: (on: boolean) => void;
}

export type ExperienceStore = ExperienceState & ExperienceActions;

export const initialState: ExperienceState = {
  phase: "boot",
  hovered: null,
  selected: null,
  windowOpen: false,
  screenRect: null,
  screenLayout: null,
  scene: "pending",
  quality: "high",
  theme: "day",
  pcHovered: false,
  explored: false,
  fullView: false,
  anchor: null,
};

export function createExperienceStore(initial: Partial<ExperienceState> = {}) {
  return createStore<ExperienceStore>()((set, get) => ({
    ...initialState,
    ...initial,

    finishBoot: () => {
      if (get().phase === "boot") set({ phase: "overview" });
    },

    hover: (id) => {
      if (get().hovered === id) return;
      set(id ? { hovered: id, explored: true } : { hovered: null });
    },

    select: (id, anchor) => {
      const { selected, windowOpen, scene } = get();
      if (selected === id) {
        if (anchor) set({ anchor });
        return;
      }
      set({
        anchor: anchor ?? null,
        phase: "focused",
        selected: id,
        hovered: null,
        explored: true,
        // Keep an open window open (content swaps in place). Without a scene there is no
        // camera to wait for, so open straight away.
        windowOpen: windowOpen || scene !== "ready",
      });
    },

    back: () => {
      if (get().selected === null) return;
      set({ phase: "overview", selected: null, windowOpen: false, fullView: false, anchor: null });
    },

    revealWindow: () => {
      if (get().selected !== null && !get().windowOpen) set({ windowOpen: true });
    },

    setScreenRect: (rect) => set({ screenRect: rect }),
    setScreenLayout: (rect) => set({ screenLayout: rect }),
    setScene: (status) => set({ scene: status }),
    setQuality: (tier) => set({ quality: tier }),
    setTheme: (theme) => {
      if (get().theme !== theme) set({ theme });
    },
    toggleTheme: () => set({ theme: get().theme === "day" ? "night" : "day" }),
    setPcHovered: (hovered) => {
      if (get().pcHovered !== hovered) set({ pcHovered: hovered });
    },
    clearAnchor: () => {
      if (get().anchor !== null) set({ anchor: null });
    },
    setFullView: (on) => {
      const next = on && get().selected !== null;
      if (get().fullView !== next) set({ fullView: next });
    },
  }));
}

/** App-wide singleton. Tests create their own with `createExperienceStore`. */
export const experienceStore = createExperienceStore();

export function useExperience<T>(selector: (state: ExperienceStore) => T): T {
  return useStore(experienceStore, selector);
}
