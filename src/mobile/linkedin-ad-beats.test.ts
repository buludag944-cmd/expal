import { describe, expect, it } from "vitest";
import {
  LINKEDIN_AD_BEATS,
  LINKEDIN_AD_DURATION_MS,
  linkedInAdBeatAt,
  linkedInAdHomeAppearances,
} from "./linkedin-ad-beats";

describe("LinkedIn marketing ad beats", () => {
  it("runs a LinkedIn-length product cut, not a personal story", () => {
    expect(LINKEDIN_AD_DURATION_MS).toBeGreaterThanOrEqual(30_000);
    expect(LINKEDIN_AD_DURATION_MS).toBeLessThanOrEqual(45_000);
    expect(LINKEDIN_AD_BEATS[0]?.kind).toBe("hook");
    expect(LINKEDIN_AD_BEATS.at(-1)?.kind).toBe("cta");
    expect(LINKEDIN_AD_BEATS.at(-1)?.endMs).toBe(LINKEDIN_AD_DURATION_MS);
  });

  it("labels the four live screenshots as feature names only", () => {
    const phones = LINKEDIN_AD_BEATS.filter((beat) => beat.kind === "phone");
    expect(phones.map((beat) => beat.caption)).toEqual(["Home", "Explore", "Journey", "Profile"]);
    expect(linkedInAdHomeAppearances()).toBe(1);
    expect(new Set(phones.map((beat) => beat.shot)).size).toBe(4);
  });

  it("does not narrate screenshot contents or a founder story", () => {
    const blob = JSON.stringify(LINKEDIN_AD_BEATS).toLowerCase();
    expect(blob).not.toMatch(/bahar|107 days|pps number|claude|cursor|adtech|i built|i moved/);
    expect(blob.includes("...without")).toBe(false);
  });

  it("hooks on Ireland and closes on a download CTA", () => {
    expect(linkedInAdBeatAt(500).caption).toMatch(/Ireland/);
    expect(LINKEDIN_AD_BEATS.at(-1)?.caption).toMatch(/Download EXPal free/);
  });

  it("covers a continuous timeline", () => {
    for (let i = 1; i < LINKEDIN_AD_BEATS.length; i += 1) {
      expect(LINKEDIN_AD_BEATS[i].startMs).toBe(LINKEDIN_AD_BEATS[i - 1].endMs);
    }
  });
});
