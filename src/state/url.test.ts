import { describe, expect, it } from "vitest";
import { readPart, withPart } from "./url";

describe("url helpers", () => {
  it("reads a valid part", () => {
    expect(readPart("?part=gpu")).toBe("gpu");
  });

  it("ignores unknown parts", () => {
    expect(readPart("?part=toaster")).toBeNull();
    expect(readPart("")).toBeNull();
  });

  it("sets and removes the param while keeping others", () => {
    expect(withPart("https://x.dev/?ref=cv#top", "cpu")).toBe("/?ref=cv&part=cpu#top");
    expect(withPart("https://x.dev/?part=cpu&ref=cv", null)).toBe("/?ref=cv");
  });
});
