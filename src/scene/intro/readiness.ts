/**
 * Lets slow setup work (like generating the desk grain) hold the opening until it's done, so
 * the animation never stutters or swaps textures halfway through.
 */
const holds = new Set<symbol>();
let waiters: (() => void)[] = [];

/** Registers work the intro should wait for. Call the returned function when it's done. */
export function holdIntro(): () => void {
  const token = Symbol("intro-hold");
  holds.add(token);
  return () => {
    if (!holds.delete(token) || holds.size > 0) return;
    const ready = waiters;
    waiters = [];
    ready.forEach((resolve) => resolve());
  };
}

/** Resolves when nothing holds the intro (or after `timeoutMs`, so it can never hang). */
export function introReady(timeoutMs: number): Promise<void> {
  if (holds.size === 0) return Promise.resolve();
  return new Promise((resolve) => {
    waiters.push(resolve);
    setTimeout(resolve, timeoutMs);
  });
}
