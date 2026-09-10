import { describe, expect, it } from "vitest";
import { AD_BEATS, AD_DURATION_MS, beatAt, homeAppearances } from "./ad-beats";

describe("marketing ad beats", () => {
  it("runs 25–30 seconds and ends on a CTA", () => {
    expect(AD_DURATION_MS).toBeGreaterThanOrEqual(25_000);
    expect(AD_DURATION_MS).toBeLessThanOrEqual(30_000);
    expect(AD_BEATS.at(-1)?.kind).toBe("cta");
    expect(AD_BEATS.at(-1)?.endMs).toBe(AD_DURATION_MS);
    expect(AD_BEATS[0]?.startMs).toBe(0);
  });

  it("opens on the pain point before any app UI", () => {
    expect(AD_BEATS[0]?.kind).toBe("hook");
    expect(beatAt(2_000).kind).toBe("hook");
    expect(beatAt(3_500).kind).toBe("phone");
    expect(beatAt(3_500).tab).toBe("home");
  });

  it("shows the home screen only once", () => {
    expect(homeAppearances()).toBe(1);
    expect(beatAt(8_000).overlay).toBe("housing");
    expect(beatAt(13_000).tab).toBe("community");
    expect(beatAt(18_000).overlay).toBe("knowhow");
  });

  it("keeps captions to one short punchy line", () => {
    for (const beat of AD_BEATS) {
      expect(beat.caption.includes("\n")).toBe(false);
      expect(beat.caption.length).toBeLessThanOrEqual(42);
      expect(beat.caption.endsWith(".")).toBe(false);
      expect(beat.caption.toLowerCase().includes("without")).toBe(false);
    }
  });

  it("covers a continuous timeline without gaps", () => {
    for (let i = 1; i < AD_BEATS.length; i += 1) {
      expect(AD_BEATS[i].startMs).toBe(AD_BEATS[i - 1].endMs);
    }
  });
});
