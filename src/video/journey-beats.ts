export type JourneyBeatId = "hook" | "map" | "login" | "profile" | "layout" | "close";

export type JourneyBeat = {
  id: JourneyBeatId;
  from: number;
  durationInFrames: number;
  kicker: string;
  caption: string;
  captionLine2: string;
  voice: string;
};

export const JOURNEY_FPS = 30;
/** LinkedIn 4:5. Captions stay inside the frame, above the player chrome. */
export const JOURNEY_WIDTH = 1080;
export const JOURNEY_HEIGHT = 1350;

/** ~1s of air before the first sentence of each beat. */
export const TTS_LEAD_IN_MS = 1_000;
/** Pause between sentences inside a beat (0.4–0.7s). */
export const TTS_BETWEEN_SENTENCES_MS = 550;

export const JOURNEY_BEATS: JourneyBeat[] = [
  {
    id: "hook",
    from: 0,
    durationInFrames: 270,
    kicker: "Founder's & builder's journey",
    caption: "Three bugs I hit while building EXPal.",
    captionLine2: "And the map I wrote first.",
    voice: "Three bugs I hit while building EXPal. And the map I wrote first.",
  },
  {
    id: "map",
    from: 270,
    durationInFrames: 690,
    kicker: "Map the product first",
    caption: "Map the front door before the features.",
    captionLine2: "Public page. Journal. Then Google sign-in.",
    voice:
      "Map the front door before the features. A public page, no login, and a journal I can post. Then the same Google sign-in as the app. Housing, PPS, IRP, community, and referrals.",
  },
  {
    id: "login",
    from: 960,
    durationInFrames: 510,
    kicker: "Bug 01 · The door",
    caption: "Don't hide that page behind a login wall.",
    captionLine2: "Public journal. Account only when someone asks.",
    voice:
      "Don't hide that page behind a login wall. Strangers can't land, and search can't see it. Keep the journal public, and open an account only when someone asks.",
  },
  {
    id: "profile",
    from: 1_470,
    durationInFrames: 480,
    kicker: "Bug 02 · The profile",
    caption: "Don't put Gmail on the public profile.",
    captionLine2: "Dublin and a work permit. Not an inbox.",
    voice:
      "Don't put a Gmail address on the public profile. Dublin and a work permit are the identity. And don't add a sentence the real screen never had.",
  },
  {
    id: "layout",
    from: 1_950,
    durationInFrames: 540,
    kicker: "Bug 03 · The frame",
    caption: "Don't crop a wide recording into a phone.",
    captionLine2: "Design the frame. Burn the captions.",
    voice:
      "Don't crop a wide recording into a phone. The navigation fell off, and a stray word stayed in frame. Design the frame, burn the captions, because LinkedIn starts muted.",
  },
  {
    id: "close",
    from: 2_490,
    durationInFrames: 420,
    kicker: "What I would not repeat",
    caption: "Map it. Then fix what the screen shows.",
    captionLine2: "Relocate smarter. Settle faster. Thrive longer.",
    voice:
      "Map it. Then fix what the screen shows. Relocate smarter, settle faster, and thrive longer.",
  },
];

export const JOURNEY_DURATION_IN_FRAMES = JOURNEY_BEATS.reduce(
  (total, beat) => total + beat.durationInFrames,
  0,
);
export const JOURNEY_DURATION_MS = (JOURNEY_DURATION_IN_FRAMES / JOURNEY_FPS) * 1000;

export function splitVoiceSentences(text: string): string[] {
  return text
    .split(/(?<=[.?!])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function journeyBeatAtFrame(frame: number): JourneyBeat {
  const clamped = Math.max(0, Math.min(frame, JOURNEY_DURATION_IN_FRAMES - 1));
  return (
    JOURNEY_BEATS.find(
      (beat) => clamped >= beat.from && clamped < beat.from + beat.durationInFrames,
    ) ?? JOURNEY_BEATS[JOURNEY_BEATS.length - 1]
  );
}

export function journeyBeatStartMs(beat: JourneyBeat): number {
  return (beat.from / JOURNEY_FPS) * 1000;
}
