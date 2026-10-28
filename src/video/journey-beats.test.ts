import { describe, expect, it } from "vitest";
import {
  JOURNEY_BEATS,
  JOURNEY_DURATION_IN_FRAMES,
  JOURNEY_DURATION_MS,
  JOURNEY_FPS,
  JOURNEY_HEIGHT,
  JOURNEY_WIDTH,
  TTS_BETWEEN_SENTENCES_MS,
  TTS_LEAD_IN_MS,
  journeyBeatAtFrame,
  splitVoiceSentences,
} from "./journey-beats";

describe("EXPal founder journey beats", () => {
  it("is a short LinkedIn 4:5 lesson", () => {
    expect(JOURNEY_FPS).toBe(30);
    expect(JOURNEY_WIDTH).toBe(1080);
    expect(JOURNEY_HEIGHT).toBe(1350);
    expect(JOURNEY_DURATION_IN_FRAMES).toBe(2_910);
    expect(JOURNEY_DURATION_MS).toBe(97_000);
  });

  it("leaves air before and between spoken sentences", () => {
    expect(TTS_LEAD_IN_MS).toBeGreaterThanOrEqual(900);
    expect(TTS_LEAD_IN_MS).toBeLessThanOrEqual(1_100);
    expect(TTS_BETWEEN_SENTENCES_MS).toBeGreaterThanOrEqual(400);
    expect(TTS_BETWEEN_SENTENCES_MS).toBeLessThanOrEqual(700);
    expect(
      splitVoiceSentences(
        "Don't put a Gmail address on the public profile. Dublin and a work permit are the identity.",
      ),
    ).toEqual([
      "Don't put a Gmail address on the public profile.",
      "Dublin and a work permit are the identity.",
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

  it("teaches the map, then the three bugs, then the motto", () => {
    expect(JOURNEY_BEATS.map((beat) => beat.id)).toEqual([
      "hook",
      "map",
      "login",
      "profile",
      "layout",
      "close",
    ]);
    expect(journeyBeatAtFrame(0).caption).toMatch(/Three bugs/);
    expect(journeyBeatAtFrame(400).caption).toMatch(/front door/);
    expect(journeyBeatAtFrame(1_000).caption).toMatch(/login wall/);
    expect(journeyBeatAtFrame(1_600).caption).toMatch(/Gmail/);
    expect(journeyBeatAtFrame(2_100).caption).toMatch(/crop/);
    expect(JOURNEY_BEATS.at(-1)?.captionLine2).toMatch(/Thrive longer/);
    expect(JOURNEY_BEATS.at(-1)?.voice).toMatch(/Relocate smarter, settle faster, and thrive longer/);
  });

  it("keeps private email addresses and the retired tagline out of the script", () => {
    const blob = JSON.stringify(JOURNEY_BEATS);
    expect(blob).not.toMatch(/uludag944|@gmail\.com/i);
    expect(blob).not.toMatch(/Move\. Settle\. Connect/);
    expect(blob).toMatch(/no login/);
    expect(blob).toMatch(/Housing, PPS, IRP/);
    expect(blob).toMatch(/real screen never had/);
    expect(blob).toMatch(/LinkedIn starts muted/);
  });
});
