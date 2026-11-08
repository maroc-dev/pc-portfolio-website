import { CanvasTexture, SRGBColorSpace } from "three";
import { PART_ANCHORS, boardUV } from "../layout";

/** Traces are laid out on a 1024 × 1536 grid and rendered at 1.5× so they stay sharp up close. */
const W = 1024;
const H = 1536;
const SCALE = 1.5;

/** Deterministic PRNG so the board looks the same on every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Board point (tower frame) → canvas pixels. */
function px(x: number, y: number): [number, number] {
  const [u, v] = boardUV(x, y);
  return [u * W, (1 - v) * H];
}

type Path = [number, number][];

/** Traces leave the CPU socket, run straight, bend 45°, then run on: "power flows outward". */
function routeTraces(rand: () => number): Path[] {
  const [cx, cy] = px(PART_ANCHORS.cpu.x, PART_ANCHORS.cpu.y);
  const half = 90;
  const paths: Path[] = [];
  const dirs: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const [dx, dy] of dirs) {
    for (let i = 0; i < 16; i++) {
      const offset = (i - 7.5) * 8;
      const start: [number, number] = [
        cx + dx * half + (dx === 0 ? offset : 0),
        cy + dy * half + (dy === 0 ? offset : 0),
      ];
      const run1 = 30 + rand() * 120;
      const bend = rand() < 0.5 ? -1 : 1;
      const p1: [number, number] = [start[0] + dx * run1, start[1] + dy * run1];
      const diag = 20 + rand() * 60;
      const p2: [number, number] = [
        p1[0] + (dx === 0 ? bend * diag : dx * diag),
        p1[1] + (dy === 0 ? bend * diag : dy * diag),
      ];
      const run2 = 80 + rand() * 360;
      const p3: [number, number] = [p2[0] + dx * run2, p2[1] + dy * run2];
      paths.push([start, p1, p2, p3]);
    }
  }
  // Scattered short traces elsewhere on the board.
  for (let i = 0; i < 70; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const horizontal = rand() < 0.5;
    const len = 40 + rand() * 180;
    const p1: [number, number] = horizontal ? [x + len, y] : [x, y + len];
    const d = 15 + rand() * 40;
    const p2: [number, number] = [p1[0] + d, p1[1] + d];
    paths.push([[x, y], p1, p2]);
  }
  return paths;
}

function strokePaths(ctx: CanvasRenderingContext2D, paths: Path[], color: string) {
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const [i, path] of paths.entries()) {
    ctx.lineWidth = i % 5 === 0 ? 5 : 3;
    ctx.beginPath();
    ctx.moveTo(...path[0]!);
    for (const point of path.slice(1)) ctx.lineTo(...point);
    ctx.stroke();
    const end = path[path.length - 1]!;
    ctx.beginPath();
    ctx.arc(end[0], end[1], 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function silkscreen(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(220,214,200,0.55)";
  ctx.font = "600 22px ui-monospace, monospace";
  const label = (text: string, x: number, y: number) => ctx.fillText(text, ...px(x, y));
  label("CPU_1", PART_ANCHORS.cpu.x - 0.03, PART_ANCHORS.cpu.y - 0.045);
  label("DIMM_A1 B1", PART_ANCHORS.ram.x - 0.06, PART_ANCHORS.ram.y - 0.022);
  label("M2_1", PART_ANCHORS.ssd.x - 0.07, PART_ANCHORS.ssd.y - 0.02);
  label("PCIE_1", -0.052, 0.305);
  // Mounting holes
  ctx.strokeStyle = "rgba(200,190,170,0.6)";
  ctx.lineWidth = 4;
  for (const [x, y] of [
    [-0.068, 0.408],
    [0.088, 0.408],
    [-0.068, 0.167],
    [0.088, 0.167],
  ] as const) {
    ctx.beginPath();
    ctx.arc(...px(x, y), 12, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/** Colour map (board + copper) and an emissive mask (traces only) for the motherboard. */
export function createPcbTextures() {
  const rand = mulberry32(20261107);
  const traces = routeTraces(rand);

  const colour = document.createElement("canvas");
  colour.width = W * SCALE;
  colour.height = H * SCALE;
  const c = colour.getContext("2d")!;
  c.scale(SCALE, SCALE);
  c.fillStyle = "#16201c";
  c.fillRect(0, 0, W, H);
  for (let i = 0; i < 3000; i++) {
    c.fillStyle = `rgba(255,255,255,${rand() * 0.025})`;
    c.fillRect(rand() * W, rand() * H, 2, 2);
  }
  strokePaths(c, traces, "#5e4329");
  silkscreen(c);

  const glow = document.createElement("canvas");
  glow.width = W * SCALE;
  glow.height = H * SCALE;
  const g = glow.getContext("2d")!;
  g.scale(SCALE, SCALE);
  g.fillStyle = "#000";
  g.fillRect(0, 0, W, H);
  strokePaths(g, traces, "#fff");

  const map = new CanvasTexture(colour);
  map.colorSpace = SRGBColorSpace;
  map.anisotropy = 16;
  const emissiveMap = new CanvasTexture(glow);
  emissiveMap.anisotropy = 16;
  return { map, emissiveMap };
}
