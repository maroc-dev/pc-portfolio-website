import { expect, test } from "@playwright/test";
import { dock, window } from "./helpers";

test("the whole flow works from the keyboard", async ({ page }) => {
  await page.goto("/");
  const cpu = dock(page).getByRole("button", { name: "CPU About me", exact: true });
  await cpu.focus();
  await page.keyboard.press("Enter");

  const dialog = window(page, "The Core");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "The Core" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(cpu).toBeFocused();
});
