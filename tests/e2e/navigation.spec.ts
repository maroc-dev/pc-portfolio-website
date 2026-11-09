import { expect, test } from "@playwright/test";
import { PARTS, dock, openFromDock, window } from "./helpers";

test.describe("navigating the machine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  for (const part of PARTS) {
    test(`opens ${part.heading} from the dock and returns to the desk`, async ({ page }) => {
      await openFromDock(page, part.button, part.heading);
      await expect(page).toHaveURL(new RegExp(`\\?part=${part.id}$`));
      await expect(
        dock(page).getByRole("button", { name: part.button, exact: true }),
      ).toHaveAttribute("aria-pressed", "true");

      await window(page, part.heading).getByRole("button", { name: "Back to the desk" }).click();
      await expect(window(page, part.heading)).toBeHidden();
      await expect(page).toHaveURL(/\/$/);
    });
  }

  test("switches between parts without closing the window", async ({ page }) => {
    await openFromDock(page, "CPU About me", "The Core");
    await openFromDock(page, "RAM Now and skills", "Active Memory");
    await expect(page).toHaveURL(/\?part=ram$/);
    await expect(page.getByRole("dialog")).toHaveCount(1);
  });

  test("header shortcuts open the matching sections", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "Sections" })
      .getByRole("button", { name: "Now" })
      .click();
    await expect(window(page, "Active Memory")).toBeVisible();
    await page
      .getByRole("navigation", { name: "Sections" })
      .getByRole("button", { name: "AI" })
      .click();
    await expect(window(page, "Accelerated Ideas")).toBeVisible();
  });

  test("project archive tabs filter projects", async ({ page }) => {
    await openFromDock(page, "SSD Projects", "Project Archives");
    const archive = window(page, "Project Archives");
    await archive.getByRole("tab", { name: /Apps and games/ }).click();
    await expect(archive.getByRole("heading", { name: "Solar System Explorer" })).toBeVisible();
    await expect(archive.getByRole("heading", { name: "myshell" })).toBeHidden();
  });
});
