import { expect, test } from "@playwright/test";
import { window } from "./helpers";

test("contact shows email, LinkedIn and GitHub, and never a phone number", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?part=io");
  const contact = window(page, "Connect");

  await expect(contact.getByRole("link", { name: "Write an email" })).toHaveAttribute(
    "href",
    "mailto:marco.a.ferreira.dev@gmail.com",
  );
  await expect(
    contact.getByRole("link", { name: "linkedin.com/in/marco-ferreira" }),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/marco-ferreira");
  await expect(contact.getByRole("link", { name: "github.com/maroc-dev" })).toBeVisible();

  await contact.getByRole("button", { name: "Copy address" }).click();
  await expect(contact.getByText("Copied to your clipboard.")).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "marco.a.ferreira.dev@gmail.com",
  );

  const resume = contact.getByRole("link", { name: "Download my résumé (PDF)" });
  await expect(resume).toHaveAttribute("download", "Marco_Ferreira_Resume_2026.pdf");
  const href = await resume.getAttribute("href");
  const response = await page.request.get(href!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");

  await expect(contact).not.toContainText(/\d{3}[-. )]+\d{3}[-. ]\d{4}/);
});
