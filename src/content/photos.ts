import type { Photo } from "./types";

/** A slot for one of Marco's own photos. The caption says what belongs there. */
export function photoSlot(caption: string, width = 4, height = 3): Photo {
  return { placeholder: true, caption, width, height };
}
