import { expect, test } from "@playwright/test";
import { window } from "./helpers";

test("systems architecture shows each project with its diagram", async ({ page }) => {
  await page.goto("/?part=server");
  const systems = window(page, "Connected Systems");
  const contents = systems.getByRole("navigation", { name: "Connected Systems" });
  await expect(contents.getByRole("button")).toHaveText([
    "Draftly",
    "Home cluster",
    "Distributed training",
  ]);

  const draftly = systems.getByRole("figure", { name: "Draftly architecture" });
  await expect(draftly).toContainText("Live editing server");
  await expect(draftly).toContainText("Simplified to the main pieces");

  await contents.getByRole("button", { name: "Distributed training" }).click();
  await expect(
    systems.getByRole("heading", { name: "Distributed training system" }),
  ).toBeInViewport();
});

test("the home cluster links to where it stands in Active Memory", async ({ page }) => {
  await page.goto("/?part=server");
  await window(page, "Connected Systems")
    .getByRole("button", { name: "See where it stands in Active Memory" })
    .click();
  const ram = window(page, "Active Memory");
  await expect(ram.getByRole("heading", { name: /private cloud/ })).toBeInViewport();
});
