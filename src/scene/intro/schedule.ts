/**
 * The opening sequence: the desk and its things settle into place, the PC builds itself up part
 * by part, the cable runs across the desk, then the machine powers on and the screen wakes.
 * Times are seconds on `runtime.assembly`; offsets say where each piece starts from (world
 * metres for desk items, model units inside the tower).
 */
export interface Step {
  at: number;
  duration: number;
  from: [number, number, number];
}

const step = (at: number, from: [number, number, number], duration = 0.65): Step => ({
  at,
  duration,
  from,
});

export const INTRO = {
  desk: step(0, [0, -0.3, 0], 0.8),
  monitor: step(0.3, [0, 0.4, 0]),
  keyboard: step(0.5, [0, 0, 0.35]),
  lamp: step(0.6, [0, 0.45, 0]),
  mug: step(0.75, [0, 0.3, 0]),
  lightSwitch: step(0.8, [0, 0, -0.03], 0.5),

  // The PC, inside-out: base, board, parts, cooling, then the shell closes around them.
  plinth: step(0.9, [0, 0.45, 0]),
  board: step(1.15, [0, 0, 0.3]),
  cpu: step(1.35, [0, 0, 0.3], 0.5),
  ram: step(1.45, [0, 0, 0.3], 0.5),
  ssd: step(1.55, [0, 0, 0.3], 0.5),
  nic: step(1.65, [0, 0.25, 0], 0.5),
  gpu: step(1.75, [-0.3, 0, 0.1]),
  cooling: step(1.9, [0.3, 0, 0]),
  wiring: step(2.1, [0, 0, 0.15], 0.45),
  shell: step(2.25, [0, 0.35, 0], 0.55),
  cap: step(2.45, [0, 0.3, 0], 0.55),
} as const;

/** When the assembly clock is done, the cable grows, then power and screen follow. */
export const ASSEMBLY_END = 3.2;
export const CABLE_AT = 2.9;
export const POWER_AT = 3.2;
export const SCREEN_AT = 3.6;
export const INTRO_END = 4.4;
