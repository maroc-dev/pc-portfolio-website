import { defineConfig } from "@playwright/test";

const PORT = 3200;
/** Software WebGL so the 3D scene renders in headless CI without a GPU. */
const SWIFTSHADER = [
  "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist",
];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  // Each worker renders WebGL in software; more than a couple at once starves the CPU.
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Reduced motion makes every transition land instantly, so tests check outcomes, not timing.
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    launchOptions: { args: SWIFTSHADER },
  },
  projects: [
    {
      name: "desktop",
      testIgnore: /mobile|no-webgl/,
      use: { browserName: "chromium", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      testMatch: /mobile/,
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "no-webgl",
      testMatch: /no-webgl/,
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 900 },
        launchOptions: { args: ["--disable-webgl", "--disable-3d-apis"] },
      },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
