import { describe, expect, it } from "vitest";
import { STORY_BEATS, STORY_DURATION_MS, storyBeatAt, storyHomeAppearances } from "./story-beats";

describe("LinkedIn personal story beats", () => {
  it("runs 45–60 seconds and ends on Bahar, not a product loop", () => {
    expect(STORY_DURATION_MS).toBeGreaterThanOrEqual(45_000);
    expect(STORY_DURATION_MS).toBeLessThanOrEqual(60_000);
    expect(STORY_BEATS[0]?.kind).toBe("card");
    expect(STORY_BEATS.at(-1)?.kind).toBe("close");
    expect(STORY_BEATS.at(-1)?.endMs).toBe(STORY_DURATION_MS);
  });

  it("opens on a specific Dublin moment before any app UI", () => {
    expect(storyBeatAt(1_000).kind).toBe("card");
    expect(storyBeatAt(1_000).lines?.[0]).toMatch(/PPS number/);
    expect(storyBeatAt(8_000).kind).toBe("card");
    expect(storyBeatAt(12_000).lines?.join(" ")).toMatch(/Claude and Cursor/);
    expect(storyBeatAt(16_000).kind).toBe("phone");
  });

  it("uses each live screenshot once, including home only once", () => {
    expect(storyHomeAppearances()).toBe(1);
    const phones = STORY_BEATS.filter((beat) => beat.kind === "phone");
    expect(phones.map((beat) => beat.id)).toEqual(["home", "explore", "journey", "profile"]);
    expect(new Set(phones.map((beat) => beat.shot)).size).toBe(4);
    for (const beat of phones) {
      expect(beat.shot).toMatch(/^\/story\/.+\.jpg$/);
    }
  });

  it("gives the non-engineer turn a full ten seconds", () => {
    const turnA = STORY_BEATS.find((beat) => beat.id === "turn-a");
    const turnB = STORY_BEATS.find((beat) => beat.id === "turn-b");
    expect((turnB?.endMs ?? 0) - (turnA?.startMs ?? 0)).toBe(10_000);
  });

  it("names both stores on the close", () => {
    const close = STORY_BEATS.find((beat) => beat.id === "close-copy");
    expect(close?.lines?.[0]).toMatch(/App Store/);
    expect(close?.lines?.[0]).toMatch(/Google Play/);
  });

  it("covers a continuous timeline without leftover landscape copy", () => {
    for (let i = 1; i < STORY_BEATS.length; i += 1) {
      expect(STORY_BEATS[i].startMs).toBe(STORY_BEATS[i - 1].endMs);
    }
    const blob = JSON.stringify(STORY_BEATS);
    expect(blob.includes("...without")).toBe(false);
    expect(blob.toLowerCase().includes("without getting lost")).toBe(false);
  });
});
