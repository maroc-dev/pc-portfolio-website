import { Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { PART_IDS } from "@/content/types";
import { frame, monitorPose, overviewPose, partPose } from "./camera-presets";

describe("camera presets", () => {
  it("backs off further for narrow viewports so the same width fits", () => {
    const framing = {
      target: new Vector3(),
      direction: new Vector3(0, 0, 1),
      width: 1,
      height: 0.5,
      fov: 30,
    };
    expect(frame(framing, 0.5).position.z).toBeGreaterThan(frame(framing, 2).position.z);
  });

  it("has a finite pose for every part at desktop and phone aspects", () => {
    for (const aspect of [16 / 9, 390 / 844]) {
      for (const id of PART_IDS) {
        const pose = partPose(id, aspect);
        expect(Number.isFinite(pose.position.length())).toBe(true);
      }
      expect(Number.isFinite(overviewPose(aspect).position.length())).toBe(true);
      expect(Number.isFinite(monitorPose(aspect).position.length())).toBe(true);
    }
  });

  it("puts part close-ups nearer than the overview", () => {
    const overview = overviewPose(16 / 9);
    const cpu = partPose("cpu", 16 / 9);
    expect(cpu.position.distanceTo(cpu.target)).toBeLessThan(
      overview.position.distanceTo(overview.target),
    );
  });
});
