/**
 * Hand-stuck labels are never perfectly straight. A small, stable tilt per label (in degrees),
 * derived from its text so it never changes between renders.
 */
export function tapeTilt(key: string, max = 2.5): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return ((Math.abs(hash) % 1000) / 1000 - 0.5) * 2 * max;
}
