import { PerspectiveCamera, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { projectRect, rectChanged } from "./screen-rect";

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
