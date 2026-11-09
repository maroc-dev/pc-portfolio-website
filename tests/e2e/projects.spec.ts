import { expect, test } from "@playwright/test";
import { window } from "./helpers";

test("projects lead with the highlights, then GooseDB, then every drive", async ({ page }) => {
  await page.goto("/?part=ssd");
  const archive = window(page, "Project Archives");
  const contents = archive.getByRole("navigation", { name: "Project Archives" });
  await expect(contents.getByRole("button")).toHaveText([
    "Highlights",
    "Building now",
    "All projects",
  ]);

  // The two big projects come first, each with its diagram.
  const highlights = archive.locator("#archive-highlights");
  await expect(highlights.getByRole("article")).toHaveCount(2);
  await expect(highlights.getByRole("article", { name: "Draftly" })).toBeVisible();
  await expect(highlights.getByRole("article", { name: "OptiSQL" })).toBeVisible();
  await expect(highlights.getByRole("figure", { name: "OptiSQL architecture" })).toContainText(
    "Physical optimizer",
  );
  await expect(archive.locator("#archive-building")).toContainText("GooseDB");

  // Featured projects aren't repeated on the drives.
  await archive.getByRole("tab", { name: /AI and machine learning/ }).click();
  await expect(
    archive.getByRole("heading", { name: "Face and digit classification" }),
  ).toBeVisible();
  await expect(
    archive.getByRole("figure", { name: "Face and digit classification architecture" }),
  ).toBeVisible();
});
