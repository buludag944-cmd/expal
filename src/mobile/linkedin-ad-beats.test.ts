import { describe, expect, it } from "vitest";
import {
  LINKEDIN_AD_BEATS,
  LINKEDIN_AD_DURATION_MS,
  linkedInAdBeatAt,
  linkedInAdHomeAppearances,
} from "./linkedin-ad-beats";

describe("LinkedIn marketing ad beats", () => {
  it("runs a LinkedIn-length product cut timed to the full transcript", () => {
    expect(LINKEDIN_AD_DURATION_MS).toBeGreaterThanOrEqual(50_000);
    expect(LINKEDIN_AD_DURATION_MS).toBeLessThanOrEqual(60_000);
    expect(LINKEDIN_AD_BEATS[0]?.kind).toBe("hook");
    expect(LINKEDIN_AD_BEATS.at(-1)?.kind).toBe("cta");
    expect(LINKEDIN_AD_BEATS.at(-1)?.endMs).toBe(LINKEDIN_AD_DURATION_MS);
  });

  it("keeps the four live screenshots, each once", () => {
    const phones = LINKEDIN_AD_BEATS.filter((beat) => beat.kind === "phone");
    expect(phones.map((beat) => beat.id)).toEqual(["home", "explore", "journey", "profile"]);
    expect(linkedInAdHomeAppearances()).toBe(1);
    expect(new Set(phones.map((beat) => beat.shot)).size).toBe(4);
  });

  it("uses the marketing transcript, not a founder story", () => {
    const blob = JSON.stringify(LINKEDIN_AD_BEATS);
    expect(blob).toMatch(/twenty-five open tabs/);
    expect(blob).toMatch(/Meet EXPal/);
    expect(blob).toMatch(/PPS, IRP/);
    expect(blob).toMatch(/No ads\. No noise/);
    expect(blob).toMatch(/Relocate smarter/);
    expect(blob).toMatch(/settle faster/);
    expect(blob).toMatch(/thrive longer/);
    expect(blob).not.toMatch(/Move\. Settle\. Connect/);
    expect(blob.toLowerCase()).not.toMatch(/bahar|claude|cursor|adtech|i built|i moved/);
    expect(blob.includes("...without")).toBe(false);
  });

  it("opens on the country move and closes on the slogan", () => {
    expect(linkedInAdBeatAt(500).caption).toMatch(/new country/);
    expect(LINKEDIN_AD_BEATS.at(-1)?.caption).toMatch(/Relocate smarter/);
    expect(LINKEDIN_AD_BEATS.at(-1)?.captionLine2).toMatch(/thrive longer/);
  });

  it("covers a continuous timeline", () => {
    for (let i = 1; i < LINKEDIN_AD_BEATS.length; i += 1) {
      expect(LINKEDIN_AD_BEATS[i].startMs).toBe(LINKEDIN_AD_BEATS[i - 1].endMs);
    }
  });
});
