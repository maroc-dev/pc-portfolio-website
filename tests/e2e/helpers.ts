import { expect, type Page } from "@playwright/test";

export const PARTS = [
  { id: "cpu", button: "CPU About me", heading: "The Core" },
  { id: "gpu", button: "GPU AI and graphics", heading: "Accelerated Ideas" },
  { id: "ram", button: "RAM Now and skills", heading: "Active Memory" },
  { id: "ssd", button: "SSD Projects", heading: "Project Archives" },
  { id: "nic", button: "NIC Distributed systems", heading: "Connected Systems" },
  { id: "io", button: "I/O Contact", heading: "Connect" },
] as const;

export function dock(page: Page) {
  return page.getByRole("navigation", { name: "Parts of the machine" });
}

export function window(page: Page, heading: string) {
  return page.getByRole("dialog", { name: heading });
}

export async function openFromDock(page: Page, button: string, heading: string) {
  await dock(page).getByRole("button", { name: button, exact: true }).click();
  await expect(window(page, heading)).toBeVisible();
}
