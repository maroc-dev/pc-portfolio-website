import { expect, test } from "@playwright/test";
import { window } from "./helpers";

test("AI projects open as drop-downs with their architecture", async ({ page }) => {
  await page.goto("/?part=gpu");
  const ai = window(page, "Accelerated Ideas");
  await expect(ai.getByRole("heading", { name: "Professional", level: 3 })).toBeVisible();
  await expect(ai.getByRole("heading", { name: "Personal", level: 3 })).toBeVisible();

  const sample = ai.getByRole("img", { name: /Example network diagram/ });
  await expect(sample).toBeHidden();
  await ai.getByText("Network diagram generator").click();
  await expect(sample).toBeVisible();
  const architecture = ai.getByRole("figure", { name: "Network diagram generator architecture" });
  await expect(architecture).toContainText("Topology");
  await expect(architecture).toContainText("Simplified architecture");
});

test("About me links straight to a project in the AI section", async ({ page }) => {
  await page.goto("/?part=cpu");
  await window(page, "The Core")
    .getByRole("button", { name: "See how the diagram tool works" })
    .click();

  const ai = window(page, "Accelerated Ideas");
  await expect(ai).toBeVisible();
  await expect(page.locator("#ai-network-diagrams")).toHaveAttribute("open", "");
  // Scrolled to the top of that project, not just the top of the section.
  await expect(ai.getByRole("heading", { name: "Network diagram generator" })).toBeInViewport();
});
