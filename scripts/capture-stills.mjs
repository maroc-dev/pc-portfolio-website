/**
 * Captures the scene's still images from a running site (default http://localhost:3000):
 *
 * - public/stills/intro-{day,night}-{wide,tall}.jpg  the exact frame the opening starts on, shown
 *   while the scene prepares so the canvas fades in over an identical picture
 * - public/poster.jpg                                the finished desk, for the no-WebGL fallback
 * - src/app/opengraph-image.jpg                      the finished desk, for link previews
 *
 * Reads the canvas itself (no DOM overlay). Run on a real GPU; software rendering differs.
 *   node scripts/capture-stills.mjs [baseUrl]
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";

const BASE = process.argv[2] ?? "http://localhost:3000";
const GPU_ARGS = ["--use-angle=gl-egl", "--ignore-gpu-blocklist", "--enable-gpu"];

/** Keep the WebGL drawing buffer readable after each frame. */
function preserveDrawingBuffer() {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attributes) {
    if (type === "webgl2" || type === "webgl") {
      attributes = { ...attributes, preserveDrawingBuffer: true };
    }
    return original.call(this, type, attributes);
  };
}

/** Resolves with the canvas pixels at the instant the opening reveals it (its first frame). */
function grabOpeningFrame() {
  return new Promise((resolve) => {
    const watch = () => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return requestAnimationFrame(watch);
      new MutationObserver(() => {
        if (canvas.style.opacity === "1") resolve(canvas.toDataURL("image/png"));
      }).observe(canvas, { attributes: true, attributeFilter: ["style"] });
    };
    watch();
  });
}

async function open(browser, { width, height, scale, theme }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
    hasTouch: width < 768,
  });
  await context.addInitScript(preserveDrawingBuffer);
  await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
  const page = await context.newPage();
  return { context, page };
}

const toBuffer = (dataUrl) => Buffer.from(dataUrl.split(",")[1], "base64");

const browser = await chromium.launch({ args: GPU_ARGS });
await mkdir("public/stills", { recursive: true });

// Opening frames: wide (desktop) and tall (phone hero), day and night.
const shapes = [
  { name: "wide", width: 1440, height: 900, scale: 2, resize: 1920 },
  { name: "tall", width: 390, height: 844, scale: 3, resize: 780 },
];
for (const theme of ["day", "night"]) {
  for (const shape of shapes) {
    const { context, page } = await open(browser, { ...shape, theme });
    await page.goto(BASE);
    const png = toBuffer(await page.evaluate(grabOpeningFrame));
    const out = `public/stills/intro-${theme}-${shape.name}.jpg`;
    await sharp(png)
      .resize({ width: shape.resize })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
    console.log("wrote", out);
    await context.close();
  }
}

// The finished desk, once the opening is over.
async function finished(width, height, scale) {
  const { context, page } = await open(browser, { width, height, scale, theme: "day" });
  await page.goto(BASE);
  await page.getByText("Hover over the PC").waitFor({ timeout: 30000 });
  await page.waitForTimeout(1500);
  const png = toBuffer(await page.evaluate(() => document.querySelector("canvas").toDataURL()));
  await context.close();
  return png;
}

await sharp(await finished(1440, 900, 2))
  .resize({ width: 1920 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/poster.jpg");
console.log("wrote public/poster.jpg");

// The canvas renders at 1.5x or more, so scale back to the 1200 x 630 preview size.
await sharp(await finished(1200, 630, 1))
  .resize({ width: 1200, height: 630 })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile("src/app/opengraph-image.jpg");
console.log("wrote src/app/opengraph-image.jpg");

await browser.close();
