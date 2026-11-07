import { expect, test } from "@playwright/test";
import { dock, window } from "./helpers";

test.use({ reducedMotion: "no-preference" });

test("with motion, the camera travels before the window opens", async ({ page }) => {
  // Software WebGL renders slowly, so the timed camera move takes much longer than on real hardware.
  test.slow();
  await page.goto("/");
  await dock(page).getByRole("button", { name: "CPU About me", exact: true }).click();
  await expect(page).toHaveURL(/\?part=cpu$/);
  await expect(window(page, "The Core")).toBeVisible({ timeout: 80_000 });
});
