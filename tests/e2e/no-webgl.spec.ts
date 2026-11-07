import { expect, test } from "@playwright/test";
import { openFromDock } from "./helpers";

test("without WebGL the content is still fully reachable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("the 3D view is off")).toBeVisible();
  await openFromDock(page, "I/O Contact", "Connect");
});
