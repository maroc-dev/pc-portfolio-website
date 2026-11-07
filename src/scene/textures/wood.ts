import { CanvasTexture, SRGBColorSpace } from "three";

/** Deterministic hash-based value noise, so the desk looks the same on every visit. */
function hash(x: number, y: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

function fbm(x: number, y: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 4; i++) {
    sum += valueNoise(x * freq, y * freq) * amp;
    freq *= 2.1;
    amp *= 0.5;
  }
  return sum;
}

const LIGHT = [222, 190, 146];
const DARK = [186, 145, 99];
const PLANKS = 4;

/**
 * Light oak desk top: long grain running along the desk's width, gentle knots, and faint seams
 * between glued planks. Returns a colour map and a matching roughness map (grain lines a touch
 * glossier), both large enough to stay sharp up close.
 */
export function createWoodTextures(width = 2048, height = 1024) {
  const colour = new ImageData(width, height);
  const rough = new ImageData(width, height);
  const plankHeight = height / PLANKS;

  for (let y = 0; y < height; y++) {
    const plank = Math.floor(y / plankHeight);
    const seed = plank * 17.3;
    const inPlank = (y % plankHeight) / plankHeight;
    const seam = Math.min(inPlank, 1 - inPlank) < 0.004 ? 0.75 : 1;

    for (let x = 0; x < width; x++) {
      // Warp the rings with low-frequency noise, then add fine fibres along the grain.
      const warp = fbm(x * 0.0018 + seed, y * 0.012 + seed) * 22;
      const rings = 0.5 + 0.5 * Math.sin(y * 0.55 + warp + seed);
      const fibres = valueNoise(x * 0.35, y * 2.4 + seed) * 0.18;
      const knot = Math.max(
        0,
        1 - Math.hypot((x / width - hash(plank, 3)) * 9, inPlank - 0.5) * 2.2,
      );
      const t = Math.min(1, Math.pow(rings, 4) * 0.42 + fibres + knot * 0.4);

      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        colour.data[i + c] = (LIGHT[c]! + (DARK[c]! - LIGHT[c]!) * t) * seam;
      }
      colour.data[i + 3] = 255;
      const r = 150 - t * 45;
      rough.data[i] = r;
      rough.data[i + 1] = r;
      rough.data[i + 2] = r;
      rough.data[i + 3] = 255;
    }
  }

  const toTexture = (data: ImageData, srgb: boolean) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.putImageData(data, 0, 0);
    const texture = new CanvasTexture(canvas);
    if (srgb) texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 16;
    return texture;
  };

  return { map: toTexture(colour, true), roughnessMap: toTexture(rough, false) };
}
