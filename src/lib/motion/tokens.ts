/** Shared motion vocabulary. Every timeline in the app pulls from here. */
export const ease = {
  /** Camera moves that start and end at rest. */
  travel: "power3.inOut",
  /** Arrivals and UI entrances. */
  arrive: "power3.out",
  /** Quick exits. */
  leave: "power2.in",
} as const;

export const duration = {
  hover: 0.15,
  beat: 0.8,
  toMonitor: 0.9,
  windowIn: 0.45,
  windowOut: 0.25,
  toOverview: 0.9,
  /** Into and out of full view. */
  zoom: 0.7,
} as const;
