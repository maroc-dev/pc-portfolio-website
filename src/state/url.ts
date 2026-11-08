import { isPartId } from "@/content/parts";
import type { PartId } from "@/content/types";

export const PART_PARAM = "part";

export function readPart(search: string): PartId | null {
  const value = new URLSearchParams(search).get(PART_PARAM);
  return isPartId(value) ? value : null;
}

/** Returns `href` with the part param set (or removed when `part` is null). */
export function withPart(href: string, part: PartId | null): string {
  const url = new URL(href);
  if (part) url.searchParams.set(PART_PARAM, part);
  else url.searchParams.delete(PART_PARAM);
  return `${url.pathname}${url.search}${url.hash}`;
}
