import { describe, expect, it } from "vitest";
import { createExperienceStore } from "./experience-store";

describe("experience store", () => {
  it("leaves boot only once", () => {
    const store = createExperienceStore();
    store.getState().finishBoot();
    expect(store.getState().phase).toBe("overview");
    store.getState().select("cpu");
    store.getState().finishBoot();
    expect(store.getState().phase).toBe("focused");
  });

  it("waits for the camera before opening the window when the scene is running", () => {
    const store = createExperienceStore({ scene: "ready" });
    store.getState().select("cpu");
    expect(store.getState()).toMatchObject({
      phase: "focused",
      selected: "cpu",
      windowOpen: false,
    });
    store.getState().revealWindow();
    expect(store.getState().windowOpen).toBe(true);
  });

  it("opens the window immediately without a scene", () => {
    const store = createExperienceStore({ scene: "unavailable" });
    store.getState().select("gpu");
    expect(store.getState().windowOpen).toBe(true);
  });

  it("keeps the window open when switching parts", () => {
    const store = createExperienceStore({ scene: "ready" });
    store.getState().select("cpu");
    store.getState().revealWindow();
    store.getState().select("ram");
    expect(store.getState()).toMatchObject({ selected: "ram", windowOpen: true });
  });

  it("clears hover on selection", () => {
    const store = createExperienceStore();
    store.getState().hover("ssd");
    store.getState().select("nic");
    expect(store.getState().hovered).toBeNull();
  });

  it("returns to the overview on back", () => {
    const store = createExperienceStore({ scene: "ready" });
    store.getState().select("io");
    store.getState().revealWindow();
    store.getState().back();
    expect(store.getState()).toMatchObject({
      phase: "overview",
      selected: null,
      windowOpen: false,
    });
  });

  it("ignores revealWindow with nothing selected", () => {
    const store = createExperienceStore({ scene: "ready" });
    store.getState().revealWindow();
    expect(store.getState().windowOpen).toBe(false);
  });
});

describe("theme and hints", () => {
  it("toggles between day and night", () => {
    const store = createExperienceStore();
    expect(store.getState().theme).toBe("day");
    store.getState().toggleTheme();
    expect(store.getState().theme).toBe("night");
    store.getState().toggleTheme();
    expect(store.getState().theme).toBe("day");
  });

  it("marks the machine explored on the first part hover or selection", () => {
    const hovering = createExperienceStore();
    hovering.getState().hover(null);
    expect(hovering.getState().explored).toBe(false);
    hovering.getState().hover("gpu");
    expect(hovering.getState().explored).toBe(true);

    const selecting = createExperienceStore();
    selecting.getState().select("io");
    expect(selecting.getState().explored).toBe(true);
  });
});
