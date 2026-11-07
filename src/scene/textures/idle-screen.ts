import { CanvasTexture, SRGBColorSpace } from "three";
import { parts } from "@/content/parts";
import { profile } from "@/content/profile";

const W = 1600;
const H = 1000;

function fontFamily(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--font-recursive");
  return value.trim() || "system-ui, sans-serif";
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function draw(ctx: CanvasRenderingContext2D, cursorOn: boolean) {
  const family = fontFamily();
  const firstName = profile.name.split(" ")[0];

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#2b221c");
  bg.addColorStop(1, "#171412");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.15, H * 1.05, 0, W * 0.15, H * 1.05, W * 0.75);
  glow.addColorStop(0, "rgba(242,166,90,0.28)");
  glow.addColorStop(1, "rgba(242,166,90,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Menu bar
  ctx.fillStyle = "rgba(243,233,220,0.06)";
  ctx.fillRect(0, 0, W, 56);
  ctx.fillStyle = "#a89c8e";
  ctx.font = `500 26px ${family}`;
  ctx.textBaseline = "middle";
  ctx.fillText("workbench", 40, 29);

  // Greeting
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f3e9dc";
  ctx.font = `800 132px ${family}`;
  const hello = `hi, I'm ${firstName}`;
  ctx.fillText(hello, 110, 380);
  if (cursorOn) {
    const x = 110 + ctx.measureText(hello).width + 18;
    ctx.fillStyle = "#f2a65a";
    ctx.fillRect(x, 270, 26, 116);
  }

  ctx.fillStyle = "#a89c8e";
  ctx.font = `400 46px ${family}`;
  ctx.fillText(profile.greeting, 114, 470);

  ctx.fillStyle = "#f2a65a";
  ctx.font = `500 40px ${family}`;
  ctx.fillText("Click any part of the machine to open it.", 114, 560);

  // App tiles mirroring the parts
  const tile = 150;
  const gap = 78;
  const total = parts.length * tile + (parts.length - 1) * gap;
  let x = (W - total) / 2;
  for (const part of parts) {
    roundRect(ctx, x, 720, tile, tile, 30);
    ctx.fillStyle = "rgba(243,233,220,0.08)";
    ctx.fill();
    ctx.strokeStyle = "rgba(242,166,90,0.35)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#f3e9dc";
    ctx.font = `700 40px ${family}`;
    ctx.textAlign = "center";
    ctx.fillText(part.label, x + tile / 2, 720 + tile / 2 + 14);
    ctx.fillStyle = "#a89c8e";
    ctx.font = `400 23px ${family}`;
    ctx.fillText(part.topic, x + tile / 2, 720 + tile + 44);
    ctx.textAlign = "left";
    x += tile + gap;
  }
}

/** The monitor's idle desktop. `setCursor` redraws with the blinking cursor on or off. */
export function createIdleScreen() {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;

  let cursorOn = true;
  const redraw = () => {
    draw(ctx, cursorOn);
    texture.needsUpdate = true;
  };
  redraw();
  // Redraw once the web font is ready so the screen uses Recursive, not the fallback.
  // A missing fallback face can reject the load; draw with whatever is available either way.
  void document.fonts
    .load(`800 132px ${fontFamily()}`)
    .catch(() => undefined)
    .then(redraw);

  return {
    texture,
    setCursor(on: boolean) {
      if (on === cursorOn) return;
      cursorOn = on;
      redraw();
    },
    dispose() {
      texture.dispose();
    },
  };
}
