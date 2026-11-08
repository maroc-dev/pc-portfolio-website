import { CanvasTexture, SRGBColorSpace } from "three";
import { parts } from "@/content/parts";
import { profile } from "@/content/profile";
import { tapeTilt } from "@/lib/tape";
import type { Theme } from "@/state/experience-store";

/** Layout space for the desktop; the canvas renders it at `scale` (1.2× on capable devices). */
const W = 2560;
const H = 1600;

const PALETTES = {
  day: {
    top: "#fbfcfe",
    bottom: "#dde8f7",
    glow: "rgba(255, 213, 92, 0.26)",
    bar: "rgba(19, 35, 74, 0.05)",
    fg: "#13234a",
    muted: "#4d5d7c",
    accent: "#1f4fbf",
    tape: "#fdfdfb",
    tapeShadow: "rgba(19, 35, 74, 0.28)",
  },
  night: {
    top: "#17233d",
    bottom: "#0d1628",
    glow: "rgba(141, 184, 255, 0.16)",
    bar: "rgba(230, 237, 251, 0.06)",
    fg: "#e6edfb",
    muted: "#9fb0cd",
    accent: "#8db8ff",
    tape: "#dfe5f0",
    tapeShadow: "rgba(0, 0, 0, 0.55)",
  },
} as const;

const TAPE_INK = "#13234a";

/** Where the text cursor sits, as fractions of the screen (origin top-left). */
export interface CursorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function fontFamily(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--font-archivo");
  return value.trim() || "system-ui, sans-serif";
}

type Stretch = "normal" | "semi-expanded" | "expanded";

/** Sets the font, including Archivo's width (the canvas shorthand alone is not honoured everywhere). */
function setFont(
  ctx: CanvasRenderingContext2D,
  weight: number,
  size: number,
  family: string,
  stretch: Stretch = "normal",
) {
  ctx.font = `${weight} ${stretch} ${size}px ${family}`;
  if ("fontStretch" in ctx) ctx.fontStretch = stretch;
}

/** A strip of label tape with its name, like the ones on the desk. */
function drawTape(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  s: number,
  family: string,
  c: (typeof PALETTES)[Theme],
): void {
  setFont(ctx, 700, 38 * s, family, "semi-expanded");
  const width = ctx.measureText(text).width + 40 * s;
  const height = 62 * s;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate((tapeTilt(text) * Math.PI) / 180);
  ctx.shadowColor = c.tapeShadow;
  ctx.shadowBlur = 14 * s;
  ctx.shadowOffsetY = 4 * s;
  ctx.fillStyle = c.tape;
  ctx.beginPath();
  ctx.roundRect(-width / 2, -height / 2, width, height, 4 * s);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = TAPE_INK;
  ctx.textBaseline = "middle";
  ctx.fillText(text, -width / 2 + 20 * s, 2 * s);
  ctx.restore();
}

/** Splits `text` into lines no wider than `max` in the current font. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > max) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
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
  setFont(ctx, 600, 26 * s, family, "semi-expanded");
  ctx.textBaseline = "middle";
  ctx.fillText("workbench", 40 * s, 29 * s);

  // Greeting
  const left = 120 * s;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = c.fg;
  setFont(ctx, 800, 150 * s, family, "expanded");
  const hello = `hi, I'm ${firstName}`;
  ctx.fillText(hello, left, 400 * s);
  const cursor: CursorRect = {
    x: (left + ctx.measureText(hello).width + 22 * s) / W,
    y: (282 * s) / H,
    width: (28 * s) / W,
    height: (128 * s) / H,
  };

  ctx.fillStyle = c.muted;
  setFont(ctx, 400, 46 * s, family);
  ctx.fillText(profile.greeting, left + 4 * s, 490 * s);

  ctx.fillStyle = c.accent;
  setFont(ctx, 600, 40 * s, family);
  ctx.fillText("Click any part of the PC to open it.", left + 4 * s, 575 * s);

  // The parts, each with its label tape and what it opens
  const column = (W - left * 2) / parts.length;
  const top = 760 * s;
  parts.forEach((part, i) => {
    const x = left + i * column;
    drawTape(ctx, part.label, x, top, s, family, c);
    ctx.fillStyle = c.fg;
    ctx.textBaseline = "alphabetic";
    setFont(ctx, 500, 32 * s, family);
    wrap(ctx, part.topic, column - 40 * s).forEach((line, n) => {
      ctx.fillText(line, x + 4 * s, top + (128 + n * 42) * s);
    });
  });
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
