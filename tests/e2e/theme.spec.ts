import { expect, test } from "@playwright/test";

test("the light switch twin toggles night and day and remembers the choice", async ({ page }) => {
  // Two full loads of the software-rendered scene.
  test.slow();
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "day");

  await page.getByRole("button", { name: /Switch to night/ }).click();
  await expect(html).toHaveAttribute("data-theme", "night");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "night");

  // The saved theme is applied before paint; the button catches up once the page hydrates.
  const toDay = page.getByRole("button", { name: /Switch to day/ });
  await expect(toDay).toBeVisible();
  await toDay.click();
  await expect(html).toHaveAttribute("data-theme", "day");
});
