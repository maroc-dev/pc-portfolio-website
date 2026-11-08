import { describe, expect, it } from "vitest";
import { DESK, createCableCurve, createEthernetCurve } from "./layout";

describe("display cable", () => {
  const curve = createCableCurve();
  const samples = curve.getSpacedPoints(400);
  const radius = 0.0045;

  it("never dips into the desk", () => {
    for (const p of samples) expect(p.y - radius).toBeGreaterThanOrEqual(0);
  });

  it("stays on the desk and in front of the wall", () => {
    for (const p of samples) {
      expect(Math.abs(p.x)).toBeLessThan(DESK.width / 2);
      expect(p.z).toBeGreaterThan(-0.55);
    }
  });

  it("clears the monitor base", () => {
    // Base footprint (see Monitor): x -0.45..-0.19, z -0.307..-0.137, 8 mm tall.
    for (const p of samples) {
      const overBase = p.x > -0.45 && p.x < -0.19 && p.z > -0.307 && p.z < -0.137;
      if (overBase) expect(p.y - radius).toBeGreaterThan(0.008);
    }
  });
});

describe("network cable", () => {
  const samples = createEthernetCurve().getSpacedPoints(400);
  const radius = 0.0028;
  const display = createCableCurve().getSpacedPoints(400);

  it("never dips into the desk", () => {
    for (const p of samples) expect(p.y - radius).toBeGreaterThanOrEqual(0);
  });

  it("keeps clear of the display cable", () => {
    for (const p of samples) {
      for (const q of display) expect(p.distanceTo(q)).toBeGreaterThan(radius + 0.0045);
    }
  });
});
