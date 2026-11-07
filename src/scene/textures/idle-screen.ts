import { CanvasTexture, SRGBColorSpace } from "three";
import { parts } from "@/content/parts";
import { profile } from "@/content/profile";
import type { Theme } from "@/state/experience-store";

/** Layout space for the desktop; the canvas renders it at `scale` (1.2× on capable devices). */
const W = 2560;
const H = 1600;

const PALETTES = {
  day: {
    top: "#f6f9ff",
    bottom: "#dbe7fa",
    glow: "rgba(255, 214, 150, 0.35)",
    bar: "rgba(27, 42, 68, 0.06)",
    fg: "#1b2a44",
    muted: "#52627d",
    accent: "#2563c9",
    tile: "rgba(255, 255, 255, 0.85)",
    tileEdge: "rgba(37, 99, 201, 0.28)",
  },
  night: {
    top: "#17233d",
    bottom: "#0d1524",
    glow: "rgba(90, 169, 255, 0.22)",
    bar: "rgba(231, 238, 252, 0.06)",
    fg: "#e7eefc",
    muted: "#9aabc8",
    accent: "#7fb2ff",
    tile: "rgba(231, 238, 252, 0.06)",
    tileEdge: "rgba(127, 178, 255, 0.35)",
  },
} as const;

/** Where the text cursor sits, as fractions of the screen (origin top-left). */
export interface CursorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function fontFamily(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--font-recursive");
  return value.trim() || "system-ui, sans-serif";
}

function draw(ctx: CanvasRenderingContext2D, theme: Theme): CursorRect {
  const c = PALETTES[theme];
  const family = fontFamily();
  const firstName = profile.name.split(" ")[0];
  const s = W / 1600;

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, c.top);
  bg.addColorStop(1, c.bottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.85, H * 0.1, 0, W * 0.85, H * 0.1, W * 0.6);
  glow.addColorStop(0, c.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Menu bar
  ctx.fillStyle = c.bar;
  ctx.fillRect(0, 0, W, 56 * s);
  ctx.fillStyle = c.muted;
  ctx.font = `500 ${26 * s}px ${family}`;
  ctx.textBaseline = "middle";
  ctx.fillText("workbench", 40 * s, 29 * s);

  // Greeting
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = c.fg;
  ctx.font = `800 ${132 * s}px ${family}`;
  const hello = `hi, I'm ${firstName}`;
  ctx.fillText(hello, 110 * s, 380 * s);
  const cursor: CursorRect = {
    x: (110 * s + ctx.measureText(hello).width + 18 * s) / W,
    y: (270 * s) / H,
    width: (26 * s) / W,
    height: (116 * s) / H,
  };

  ctx.fillStyle = c.muted;
  ctx.font = `400 ${46 * s}px ${family}`;
  ctx.fillText(profile.greeting, 114 * s, 470 * s);

  ctx.fillStyle = c.accent;
  ctx.font = `600 ${40 * s}px ${family}`;
  ctx.fillText("Click any part of the PC to open it.", 114 * s, 560 * s);

  // App tiles mirroring the parts
  const tile = 150 * s;
  const gap = 78 * s;
  const top = 720 * s;
  const total = parts.length * tile + (parts.length - 1) * gap;
  let x = (W - total) / 2;
  ctx.textAlign = "center";
  for (const part of parts) {
    ctx.beginPath();
    ctx.roundRect(x, top, tile, tile, 30 * s);
    ctx.fillStyle = c.tile;
    ctx.fill();
    ctx.strokeStyle = c.tileEdge;
    ctx.lineWidth = 3 * s;
    ctx.stroke();
    ctx.fillStyle = c.fg;
    ctx.font = `700 ${40 * s}px ${family}`;
    ctx.fillText(part.label, x + tile / 2, top + tile / 2 + 14 * s);
    ctx.fillStyle = c.muted;
    ctx.font = `400 ${23 * s}px ${family}`;
    ctx.fillText(part.topic, x + tile / 2, top + tile + 44 * s);
    x += tile + gap;
  }
  ctx.textAlign = "left";
  return cursor;
}

/**
 * The monitor's idle desktop, themed for day and night. The blinking cursor is a separate mesh
 * (see Monitor), so this large texture only re-uploads when the theme or font changes.
 */
export function createIdleScreen(theme: Theme, scale = 1.2) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;

  let current = theme;
  let cursor: CursorRect = { x: 0, y: 0, width: 0, height: 0 };
  const redraw = () => {
    cursor = draw(ctx, current);
    texture.needsUpdate = true;
  };
  redraw();
  // Redraw once the web font is ready; a missing fallback face can reject, so draw regardless.
  const ready = document.fonts
    .load(`800 132px ${fontFamily()}`)
    .catch(() => undefined)
    .then(redraw);

  return {
    texture,
    /** Resolves once the screen has been drawn with the web font. */
    ready,
    /** Latest cursor placement (changes when the font or theme redraws the greeting). */
    get cursor() {
      return cursor;
    },
    setTheme(next: Theme) {
      if (next === current) return;
      current = next;
      redraw();
    },
    dispose() {
      texture.dispose();
    },
  };
}
