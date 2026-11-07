import { expect, test } from "@playwright/test";
import { dock, window } from "./helpers";

test("phones get a tappable grid and a full-height sheet", async ({ page }) => {
  await page.goto("/");
  const projects = dock(page).getByRole("button", { name: "SSD Projects", exact: true });
  await expect(projects).toBeVisible();
  await projects.tap();

  const sheet = window(page, "Project Archives");
  await expect(sheet).toBeVisible();
  const box = await sheet.boundingBox();
  expect(box?.width).toBe(390);

  await sheet.getByRole("button", { name: "Back to the desk" }).tap();
  await expect(sheet).toBeHidden();
});
