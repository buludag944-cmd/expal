import { describe, expect, it } from "vitest";
import {
  JOURNEY_BEATS,
  JOURNEY_DURATION_IN_FRAMES,
  JOURNEY_DURATION_MS,
  JOURNEY_FPS,
  JOURNEY_HEIGHT,
  JOURNEY_WIDTH,
  journeyBeatAtFrame,
} from "./journey-beats";

describe("EXPal founder journey beats", () => {
  it("is a 70 second LinkedIn 4:5 lesson", () => {
    expect(JOURNEY_FPS).toBe(30);
    expect(JOURNEY_WIDTH).toBe(1080);
    expect(JOURNEY_HEIGHT).toBe(1350);
    expect(JOURNEY_DURATION_IN_FRAMES).toBe(2_100);
    expect(JOURNEY_DURATION_MS).toBe(70_000);
  });

  it("fills the timeline without gaps", () => {
    expect(JOURNEY_BEATS[0]?.from).toBe(0);
    const last = JOURNEY_BEATS.at(-1);
    expect(last && last.from + last.durationInFrames).toBe(JOURNEY_DURATION_IN_FRAMES);
    for (let i = 1; i < JOURNEY_BEATS.length; i += 1) {
      expect(JOURNEY_BEATS[i].from).toBe(
        JOURNEY_BEATS[i - 1].from + JOURNEY_BEATS[i - 1].durationInFrames,
      );
    }
  });

  it("covers the feature map, phone versus desktop, then the backend", () => {
    expect(JOURNEY_BEATS.map((beat) => beat.id)).toEqual([
      "welcome",
      "map",
      "layout",
      "backend",
      "close",
    ]);
    expect(journeyBeatAtFrame(0).voice).toMatch(/Welcome to Vibe-coder's Journey/);
    expect(journeyBeatAtFrame(400).voice).toMatch(/mapped the product before the screens/);
    expect(journeyBeatAtFrame(400).voice).toMatch(/Housing\. Visa and IRP\. PPS/);
    expect(journeyBeatAtFrame(900).voice).toMatch(/Desktop was fine/);
    expect(journeyBeatAtFrame(900).voice).toMatch(/pinned them/);
    expect(journeyBeatAtFrame(1_500).voice).toMatch(/redeployed/);
    expect(journeyBeatAtFrame(1_500).voice).toMatch(/real database/);
    expect(journeyBeatAtFrame(1_500).voice).toMatch(/forgot the profile/);
    expect(JOURNEY_BEATS.at(-1)?.voice).toMatch(/Relocate smarter\. Settle faster\. Thrive longer/);
  });

  it("keeps a real email address and the retired tagline out of the script", () => {
    const blob = JSON.stringify(JOURNEY_BEATS);
    expect(blob).not.toMatch(/uludag944|@gmail\.com/i);
    expect(blob).not.toMatch(/Move\. Settle\. Connect/);
  });
});
