import { describe, expect, it } from "vitest";
import { pickQualityTier } from "./quality";

const desktop = {
  coarsePointer: false,
  viewportWidth: 1440,
  hardwareConcurrency: 8,
  deviceMemory: 8,
};

describe("pickQualityTier", () => {
  it("uses high on a capable desktop", () => {
    expect(pickQualityTier(desktop)).toBe("high");
  });

  it("uses low for touch, small screens and weak hardware", () => {
    expect(pickQualityTier({ ...desktop, coarsePointer: true })).toBe("low");
    expect(pickQualityTier({ ...desktop, viewportWidth: 390 })).toBe("low");
    expect(pickQualityTier({ ...desktop, hardwareConcurrency: 2 })).toBe("low");
    expect(pickQualityTier({ ...desktop, hardwareConcurrency: 4 })).toBe("high");
    expect(pickQualityTier({ ...desktop, deviceMemory: 2 })).toBe("low");
  });

  it("ignores hints the browser does not expose", () => {
    expect(pickQualityTier({ coarsePointer: false, viewportWidth: 1440 })).toBe("high");
  });
});
