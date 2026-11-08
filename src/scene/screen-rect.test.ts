import { PerspectiveCamera, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { projectRect, rectChanged, restScreenRect } from "./screen-rect";

describe("projectRect", () => {
  it("maps a square facing the camera to a centred pixel rect", () => {
    const camera = new PerspectiveCamera(90, 1, 0.1, 10);
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const corners = [
      new Vector3(-0.5, 0.5, 0),
      new Vector3(0.5, 0.5, 0),
      new Vector3(-0.5, -0.5, 0),
      new Vector3(0.5, -0.5, 0),
    ];
    const rect = projectRect(corners, camera, { width: 200, height: 200 });
    expect(rect.left).toBeCloseTo(50);
    expect(rect.top).toBeCloseTo(50);
    expect(rect.width).toBeCloseTo(100);
    expect(rect.height).toBeCloseTo(100);
  });
});

describe("rectChanged", () => {
  const rect = { left: 10, top: 10, width: 100, height: 50 };
  it("ignores sub-pixel jitter", () => {
    expect(rectChanged(rect, { ...rect, left: 10.3 })).toBe(false);
  });
  it("detects real movement and a missing previous rect", () => {
    expect(rectChanged(rect, { ...rect, width: 102 })).toBe(true);
    expect(rectChanged(null, rect)).toBe(true);
  });
});

describe("restScreenRect", () => {
  it("gives the window a whole-pixel 16:10 layout inside the viewport", () => {
    const size = { width: 1440, height: 900 };
    const rect = restScreenRect(size);
    for (const value of Object.values(rect)) expect(Number.isInteger(value)).toBe(true);
    expect(rect.width / rect.height).toBeCloseTo(1.6, 1);
    expect(rect.left).toBeGreaterThan(0);
    expect(rect.left + rect.width).toBeLessThan(size.width);
    // The normal monitor framing leaves room around the screen for the header and dock.
    expect(rect.width / size.width).toBeCloseTo(0.62, 1);
  });
});
