import { expect, test } from "@playwright/test";
import { window } from "./helpers";

test("about me tells the journey, then education and hobbies", async ({ page }) => {
  await page.goto("/?part=cpu");
  const about = window(page, "The Core");

  for (const heading of ["My journey", "Education", "Hobbies"]) {
    await expect(about.getByRole("heading", { name: heading, level: 3 })).toBeVisible();
  }
  await expect(about.getByRole("heading", { name: "Rutgers University" })).toBeVisible();
  await expect(about.getByRole("list", { name: "Courses" })).toContainText("CS 417");
  await expect(about.getByRole("img", { name: /Old Queens/ })).toBeVisible();

  // The jump bar moves through the page and marks where the reader is.
  const jump = about.getByRole("navigation", { name: "About me" });
  await jump.getByRole("button", { name: "Hobbies" }).click();
  await expect(jump.getByRole("button", { name: "Hobbies" })).toHaveAttribute(
    "aria-current",
    "true",
  );
});
