import { expect, test } from "@playwright/test";
import { dock, openFromDock, window } from "./helpers";

test("full screen grows the window over the monitor and Esc steps back out", async ({ page }) => {
  await page.goto("/");
  await openFromDock(page, "RAM Now and skills", "Active Memory");
  const dialog = window(page, "Active Memory");
  const fullScreen = dialog.getByRole("button", { name: "Full screen" });
  const width = async () => (await dialog.boundingBox())?.width ?? 0;
  const normal = await width();

  await fullScreen.click();
  await expect(fullScreen).toHaveAttribute("aria-pressed", "true");
  await expect(dock(page)).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Sections" })).toBeHidden();
  await expect.poll(width).toBeGreaterThan(normal * 1.3);

  // First Esc leaves full view; the section stays open.
  await page.keyboard.press("Escape");
  await expect(fullScreen).toHaveAttribute("aria-pressed", "false");
  await expect(dock(page)).toBeVisible();
  await expect(dialog).toBeVisible();

  // Second Esc goes back to the desk.
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("going back to the desk leaves full view", async ({ page }) => {
  await page.goto("/?part=cpu");
  const dialog = window(page, "The Core");
  await dialog.getByRole("button", { name: "Full screen" }).click();
  await expect(dock(page)).toBeHidden();

  await dialog.getByRole("button", { name: "Back to the desk" }).click();
  await expect(dialog).toBeHidden();
  await expect(dock(page)).toBeVisible();
});
