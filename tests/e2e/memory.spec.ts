import { expect, test } from "@playwright/test";
import { window } from "./helpers";

test("RAM shows what's loaded now, the database layers and the skills", async ({ page }) => {
  await page.goto("/?part=ram");
  const ram = window(page, "Active Memory");

  for (const heading of ["Right now", "Skills"]) {
    await expect(ram.getByRole("heading", { name: heading, level: 3 })).toBeVisible();
  }
  await expect(ram.getByRole("heading", { name: /private cloud/ })).toBeVisible();

  const layers = ram.getByRole("figure", { name: "Where the two projects sit in a database" });
  await expect(layers).toContainText("GooseDB covers Storage");
  await expect(layers).toContainText("OptiSQL covers Query interface to Execution");

  // Work and learning marks are spoken, not only drawn.
  await expect(ram.getByRole("region", { name: "Languages" })).toContainText(
    "Python, used at work",
  );
  await expect(ram.getByRole("region", { name: "Distributed systems" })).toContainText(
    "Kubernetes, learning now",
  );
});

test("RAM and About me link to each other", async ({ page }) => {
  await page.goto("/?part=ram");
  await window(page, "Active Memory")
    .getByRole("button", { name: "Read about my time at Rutgers" })
    .click();
  const about = window(page, "The Core");
  await expect(about.getByRole("heading", { name: "Education", level: 3 })).toBeInViewport();

  await about.getByRole("button", { name: "See what I'm working on now" }).click();
  const ram = window(page, "Active Memory");
  await expect(ram.getByRole("heading", { name: "Right now", level: 3 })).toBeInViewport();
});
