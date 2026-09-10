import { describe, expect, it } from "vitest";
import {
  SHORT_BEATS,
  SHORT_DURATION_IN_FRAMES,
  SHORT_DURATION_MS,
  SHORT_FPS,
  SHORT_HEIGHT,
  SHORT_WIDTH,
  shortBeatAtFrame,
} from "./short-beats";

describe("EXPal 9:16 short beats", () => {
  it("matches the ExpalShort composition timing and frame size", () => {
    expect(SHORT_FPS).toBe(30);
    expect(SHORT_WIDTH).toBe(1080);
    expect(SHORT_HEIGHT).toBe(1920);
    expect(SHORT_DURATION_IN_FRAMES).toBe(1080);
    expect(SHORT_DURATION_MS).toBe(36_000);
  });

  it("fills 1080 frames without gaps", () => {
    expect(SHORT_BEATS[0]?.from).toBe(0);
    const last = SHORT_BEATS.at(-1);
    expect(last && last.from + last.durationInFrames).toBe(SHORT_DURATION_IN_FRAMES);
    for (let i = 1; i < SHORT_BEATS.length; i += 1) {
      expect(SHORT_BEATS[i].from).toBe(
        SHORT_BEATS[i - 1].from + SHORT_BEATS[i - 1].durationInFrames,
      );
    }
  });

  it("opens on the country move and closes on the new slogan", () => {
    expect(shortBeatAtFrame(0).kind).toBe("hook");
    expect(shortBeatAtFrame(10).caption).toMatch(/new country/);
    expect(SHORT_BEATS.at(-1)?.kind).toBe("cta");
    expect(SHORT_BEATS.at(-1)?.caption).toMatch(/Relocate smarter/);
    expect(SHORT_BEATS.at(-1)?.captionLine2).toMatch(/thrive longer/);
    expect(SHORT_BEATS.at(-1)?.voice).toMatch(/Relocate smarter, settle faster and thrive longer/);
  });

  it("uses live Home / Explore / Profile shots and the marketing transcript", () => {
    const phones = SHORT_BEATS.filter((beat) => beat.kind === "phone");
    expect(phones.map((beat) => beat.id)).toEqual(["home", "explore", "profile"]);
    expect(phones.every((beat) => beat.shot?.startsWith("story/"))).toBe(true);
    const blob = JSON.stringify(SHORT_BEATS);
    expect(blob).toMatch(/twenty-five open tabs/);
    expect(blob).toMatch(/Meet EXPal/);
    expect(blob).toMatch(/PPS, IRP/);
    expect(blob).not.toMatch(/Move\. Settle\. Connect/);
  });
});
