import { describe, expect, it } from "vitest";
import {
  JOURNEY_BEATS,
  JOURNEY_DURATION_IN_FRAMES,
  JOURNEY_DURATION_MS,
  JOURNEY_FPS,
  JOURNEY_HEIGHT,
  JOURNEY_WIDTH,
  journeyBeatAtFrame,
  splitVoiceSentences,
} from "./journey-beats";

describe("EXPal founder journey beats", () => {
  it("is a 70 second LinkedIn 4:5 lesson", () => {
    expect(JOURNEY_FPS).toBe(30);
    expect(JOURNEY_WIDTH).toBe(1080);
    expect(JOURNEY_HEIGHT).toBe(1350);
    expect(JOURNEY_DURATION_IN_FRAMES).toBe(2_100);
    expect(JOURNEY_DURATION_MS).toBe(70_000);
  });

  it("splits the spoken script on sentence boundaries", () => {
    expect(splitVoiceSentences("First problem. The journal stays open.")).toEqual([
      "First problem.",
      "The journal stays open.",
    ]);
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

  it("opens the series, then three problems with a fix, then the motto", () => {
    expect(JOURNEY_BEATS.map((beat) => beat.id)).toEqual([
      "welcome",
      "login",
      "profile",
      "layout",
      "close",
    ]);
    expect(journeyBeatAtFrame(0).voice).toMatch(/Welcome to Vibe-coder's Journey/);
    expect(journeyBeatAtFrame(400).voice).toMatch(/First problem/);
    expect(journeyBeatAtFrame(400).captionLine2).toMatch(/journal stays open/);
    expect(journeyBeatAtFrame(1_000).voice).toMatch(/Second problem/);
    expect(journeyBeatAtFrame(1_000).captionLine2).toMatch(/work permit/);
    expect(journeyBeatAtFrame(1_500).voice).toMatch(/Third problem/);
    expect(journeyBeatAtFrame(1_500).captionLine2).toMatch(/captions/);
    expect(JOURNEY_BEATS.at(-1)?.captionLine2).toMatch(/Thrive longer/);
    expect(JOURNEY_BEATS.at(-1)?.voice).toMatch(/Three problems\. Three fixes/);
  });

  it("keeps a real email address and the retired tagline out of the script", () => {
    const blob = JSON.stringify(JOURNEY_BEATS);
    expect(blob).not.toMatch(/uludag944|@gmail\.com/i);
    expect(blob).not.toMatch(/Move\. Settle\. Connect/);
    expect(blob).toMatch(/problems I faced/);
    expect(blob).toMatch(/I took it off/);
    expect(blob).toMatch(/real screen never had/);
    expect(blob).toMatch(/LinkedIn is on mute/);
  });
});
