import { describe, expect, it, vi } from "vitest";
import { holdIntro, introReady } from "./readiness";

describe("intro readiness", () => {
  it("resolves immediately with nothing holding it", async () => {
    await expect(introReady(1000)).resolves.toBeUndefined();
  });

  it("waits for every hold to be released", async () => {
    const a = holdIntro();
    const b = holdIntro();
    let done = false;
    const ready = introReady(10_000).then(() => {
      done = true;
    });
    a();
    await Promise.resolve();
    expect(done).toBe(false);
    b();
    await ready;
    expect(done).toBe(true);
  });

  it("gives up after the timeout so the intro never hangs", async () => {
    vi.useFakeTimers();
    const release = holdIntro();
    const ready = introReady(500);
    vi.advanceTimersByTime(500);
    await expect(ready).resolves.toBeUndefined();
    release();
    vi.useRealTimers();
  });
});
