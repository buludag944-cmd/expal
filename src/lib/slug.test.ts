import { describe, expect, it } from "vitest";
import { excerptFrom, readingTime, slugify, uniqueSlug } from "./slug";
import { parseSession, verifyPassword } from "./auth";

describe("slugify", () => {
  it("builds SEO-friendly slugs", () => {
    expect(slugify("Stamp 1 vs Stamp 4: Irish visas")).toBe(
      "stamp-1-vs-stamp-4-irish-visas",
    );
  });

  it("falls back when the title is empty", () => {
    expect(slugify("***")).toBe("post");
  });
});

describe("uniqueSlug", () => {
  it("keeps the current slug when editing", () => {
    expect(uniqueSlug("housing", ["housing", "jobs"], "housing")).toBe("housing");
  });

  it("increments collisions", () => {
    expect(uniqueSlug("housing", ["housing", "housing-2"])).toBe("housing-3");
  });
});

describe("reading helpers", () => {
  it("counts at least one minute", () => {
    expect(readingTime("Hello world")).toBe(1);
  });

  it("builds an excerpt without markdown noise", () => {
    expect(excerptFrom("## Hello **Dublin**", 80)).toContain("Hello");
  });
});

describe("admin session", () => {
  it("rejects empty cookies", () => {
    expect(parseSession(undefined)).toBe(false);
    expect(parseSession("not-a-session")).toBe(false);
  });

  it("rejects a wrong password when one is configured", () => {
    const previous = process.env.ADMIN_PASSWORD;
    process.env.ADMIN_PASSWORD = "secret";
    expect(verifyPassword("nope")).toBe(false);
    expect(verifyPassword("secret")).toBe(true);
    process.env.ADMIN_PASSWORD = previous;
  });
});
