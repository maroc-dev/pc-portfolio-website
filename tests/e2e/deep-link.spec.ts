import { expect, test } from "@playwright/test";
import { openFromDock, window } from "./helpers";

test("a deep link opens its section directly", async ({ page }) => {
  await page.goto("/?part=ram");
  await expect(window(page, "Active Memory")).toBeVisible();
});

test("an unknown part in the URL is ignored", async ({ page }) => {
  await page.goto("/?part=toaster");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("browser back closes the window and forward reopens it", async ({ page }) => {
  await page.goto("/");
  await openFromDock(page, "GPU AI and graphics", "Accelerated Ideas");
  await page.goBack();
  await expect(window(page, "Accelerated Ideas")).toBeHidden();
  await page.goForward();
  await expect(window(page, "Accelerated Ideas")).toBeVisible();
});

test("case study links go to the project page and back to the archive", async ({ page }) => {
  await page.goto("/?part=ssd");
  const archive = window(page, "Project Archives");
  await archive.getByRole("tab", { name: /Databases and backend/ }).click();
  await archive.getByRole("link", { name: "Read the case study" }).first().click();
  await expect(page).toHaveURL(/\/projects\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Back to the machine" }).click();
  await expect(window(page, "Project Archives")).toBeVisible();
});
