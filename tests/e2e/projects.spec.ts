import { expect, test } from "@playwright/test";
import { window } from "./helpers";

test("projects open with an overview of the highlights, each one a jump", async ({ page }) => {
  await page.goto("/?part=ssd");
  const archive = window(page, "Project Archives");
  const contents = archive.getByRole("navigation", { name: "Project Archives" });
  await expect(contents.getByRole("button")).toHaveText([
    "Draftly",
    "OptiSQL",
    "GooseDB",
    "All projects",
  ]);

  // The overview names each highlight with a one-line description.
  const glance = archive.getByRole("list", { name: "Highlights at a glance" });
  await expect(glance.getByRole("button")).toHaveCount(3);
  await expect(glance).toContainText("in-memory query execution engine");

  // All three highlights are shown in full, each with its diagram.
  const highlights = archive.locator("#archive-highlights");
  await expect(highlights.getByRole("article")).toHaveCount(3);
  for (const name of ["Draftly", "OptiSQL", "GooseDB"]) {
    await expect(highlights.getByRole("article", { name })).toBeVisible();
  }
  await expect(highlights.getByRole("figure", { name: "OptiSQL architecture" })).toContainText(
    "Physical optimizer",
  );

  // Choosing one in the overview jumps to its write-up.
  await glance.getByRole("button", { name: /GooseDB/ }).click();
  await expect(highlights.getByRole("heading", { name: "GooseDB", level: 4 })).toBeInViewport();

  // Featured projects aren't repeated on the drives.
  await archive.getByRole("tab", { name: /AI and machine learning/ }).click();
  await expect(
    archive.getByRole("heading", { name: "Face and digit classification" }),
  ).toBeVisible();
  await expect(
    archive.getByRole("figure", { name: "Face and digit classification architecture" }),
  ).toBeVisible();
});

test("project pages show real examples of the project working", async ({ page }) => {
  await page.goto("/projects/myshell");
  await expect(page.getByRole("heading", { name: "See it work", level: 2 })).toBeVisible();
  await expect(page.getByRole("figure", { name: "A real session" })).toContainText(
    "cat fruit.txt | grep e | wc -l",
  );
  await expect(
    page.getByRole("figure", { name: "Then it runs: one fork per command, joined by pipes" }),
  ).toContainText("pipe 1");

  await page.goto("/projects/mymalloc");
  const heap = page.getByRole("figure", { name: "The heap, one call at a time" });
  // Each step is spoken as a list of chunks, not only drawn.
  await expect(heap.getByRole("img").first()).toHaveAccessibleName(
    "a: used 32 bytes, then free 4056 bytes",
  );
});
