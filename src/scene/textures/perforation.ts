import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

const TILE = 128;

function tileTexture(draw: (ctx: CanvasRenderingContext2D) => void, repeat: [number, number]) {
  const canvas = document.createElement("canvas");
  canvas.width = TILE;
  canvas.height = TILE;
  draw(canvas.getContext("2d")!);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.anisotropy = 4;
  return texture;
}

/** Honeycomb grille (top panel, PSU shroud). One tile holds a seamless 2×2 hex arrangement. */
export function createHexTexture(base: string, hole: string, repeat: [number, number]) {
  return tileTexture((ctx) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = hole;
    const r = TILE / 4 - 5;
    const hexAt = (cx: number, cy: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
    };
    // Rows offset by half a cell; positions chosen so edges wrap seamlessly.
    for (const [cx, cy] of [
      [0, 0],
      [TILE / 2, 0],
      [TILE, 0],
      [TILE / 4, TILE / 2],
      [(3 * TILE) / 4, TILE / 2],
      [0, TILE],
      [TILE / 2, TILE],
      [TILE, TILE],
    ] as const) {
      hexAt(cx, cy);
    }
  }, repeat);
}

/** Staggered rounded slots (side mesh panel, plinth vents). */
export function createSlotTexture(base: string, hole: string, repeat: [number, number]) {
  return tileTexture((ctx) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = hole;
    const w = TILE / 2 - 14;
    const h = TILE / 4 - 12;
    const slot = (x: number, y: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, h / 2);
      ctx.fill();
    };
    slot(7, 6);
    slot(TILE / 2 + 7, 6);
    slot(-TILE / 4 + 7, TILE / 4 + 6);
    slot(TILE / 4 + 7, TILE / 4 + 6);
    slot((3 * TILE) / 4 + 7, TILE / 4 + 6);
    slot(7, TILE / 2 + 6);
    slot(TILE / 2 + 7, TILE / 2 + 6);
    slot(-TILE / 4 + 7, (3 * TILE) / 4 + 6);
    slot(TILE / 4 + 7, (3 * TILE) / 4 + 6);
    slot((3 * TILE) / 4 + 7, (3 * TILE) / 4 + 6);
  }, repeat);
}

/** Fine vertical fin lines for the radiator core. */
export function createFinTexture(base: string, gap: string, repeat: [number, number]) {
  return tileTexture((ctx) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = gap;
    for (let x = 0; x < TILE; x += 8) ctx.fillRect(x, 0, 3, TILE);
  }, repeat);
}
