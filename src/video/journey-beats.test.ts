import { describe, expect, it } from "vitest";
import {
  JOURNEY_BEATS,
  JOURNEY_DURATION_IN_FRAMES,
  JOURNEY_DURATION_MS,
  JOURNEY_FPS,
  JOURNEY_HEIGHT,
  JOURNEY_VISUALS,
  JOURNEY_WIDTH,
  journeyBeatAtFrame,
} from "./journey-beats";

describe("EXPal founder journey beats", () => {
  it("matches the cleaned voiceover on a LinkedIn 4:5 frame", () => {
    expect(JOURNEY_FPS).toBe(30);
    expect(JOURNEY_WIDTH).toBe(1080);
    expect(JOURNEY_HEIGHT).toBe(1350);
    expect(JOURNEY_DURATION_IN_FRAMES).toBe(4_149);
    expect(JOURNEY_DURATION_MS).toBe(138_300);
  });

  it("fills the timeline without gaps", () => {
    expect(JOURNEY_BEATS[0]?.from).toBe(0);
    const last = JOURNEY_BEATS.at(-1);
    expect(last && last.from + last.durationInFrames).toBe(JOURNEY_DURATION_IN_FRAMES);
    for (let i = 1; i < JOURNEY_BEATS.length; i += 1) {
      expect(JOURNEY_BEATS[i].from).toBe(
        JOURNEY_BEATS[i - 1].from + JOURNEY_BEATS[i - 1].durationInFrames,
      );
      expect(JOURNEY_BEATS[i].durationInFrames).toBeGreaterThan(0);
    }
  });

  it("follows the recorded map, phone layout, and backend", () => {
    expect(journeyBeatAtFrame(0).caption).toMatch(/Welcome to Vibe-coder's Journey/);
    expect(journeyBeatAtFrame(900).caption).toMatch(/mapped the product before the screens/);
    expect(journeyBeatAtFrame(1_280).caption).toMatch(/Visa, IRP, and PPS/);
    expect(journeyBeatAtFrame(1_450).caption).toMatch(/Community/);
    expect(journeyBeatAtFrame(1_960).caption).toMatch(/Desktop was fine/);
    expect(journeyBeatAtFrame(2_180).caption).toMatch(/Chat covered Send/);
    expect(journeyBeatAtFrame(2_750).caption).toMatch(/redeployed/);
    expect(journeyBeatAtFrame(2_850).caption).toMatch(/real database/);
    expect(journeyBeatAtFrame(3_100).caption).toMatch(/Google sign-in/);
    expect(journeyBeatAtFrame(3_400).caption).toMatch(/Firebase/);
    expect(JOURNEY_BEATS.at(-1)?.captionLine2).toMatch(/Relocate smarter\. Settle faster\. Thrive longer/);
  });

  it("keeps names, emails, and the retired tagline off the screen", () => {
    const blob = JSON.stringify({ JOURNEY_BEATS, JOURNEY_VISUALS });
    expect(blob).not.toMatch(/uludag|bahar|@gmail\.com|gmail\.com/i);
    expect(blob).not.toMatch(/Move\. Settle\. Connect/);
    expect(blob).not.toMatch(/profile\.jpg|story\/home\.jpg/);
  });
});
