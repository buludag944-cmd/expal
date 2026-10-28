export type JourneyBeatId = "hook" | "map" | "login" | "profile" | "layout" | "close";

export type JourneyBeat = {
  id: JourneyBeatId;
  from: number;
  durationInFrames: number;
  kicker: string;
  caption: string;
  captionLine2: string;
  /** Spoken script for Bahar to record. The picture cut is silent. */
  voice: string;
};

export const JOURNEY_FPS = 30;
/** LinkedIn 4:5. Captions stay inside the frame, above the player chrome. */
export const JOURNEY_WIDTH = 1080;
export const JOURNEY_HEIGHT = 1350;

export const JOURNEY_BEATS: JourneyBeat[] = [
  {
    id: "hook",
    from: 0,
    durationInFrames: 210,
    kicker: "Founder's & builder's journey",
    caption: "I didn't start with “build my app.”",
    captionLine2: "I mapped it first.",
    voice: "I didn't start EXPal by saying build my app. I mapped it first.",
  },
  {
    id: "map",
    from: 210,
    durationInFrames: 480,
    kicker: "Map the product first",
    caption: "No login. A journal I can post.",
    captionLine2: "Then Google sign-in. Then the move.",
    voice:
      "A page you can open without logging in. A journal I can post. Sign-in is the same Google account as the app. Then the move itself: housing, PPS, IRP, community, referrals.",
  },
  {
    id: "login",
    from: 690,
    durationInFrames: 390,
    kicker: "Bug 01 · The door",
    caption: "The old site threw everyone onto login.",
    captionLine2: "The journal stays open.",
    voice:
      "The old site threw everyone onto login. Nothing to land on, nothing to find. The journal stays open. Account only when you want one.",
  },
  {
    id: "profile",
    from: 1_080,
    durationInFrames: 420,
    kicker: "Bug 02 · The profile",
    caption: "My Gmail was on the public profile.",
    captionLine2: "Dublin, and a work permit.",
    voice:
      "My Gmail was on the public profile. That's not a name. Dublin, and a work permit. I cut the line the real screen never had.",
  },
  {
    id: "layout",
    from: 1_500,
    durationInFrames: 360,
    kicker: "Bug 03 · The frame",
    caption: "I squeezed a wide video into a phone.",
    captionLine2: "Build the frame. Write the captions.",
    voice:
      "I squeezed a wide video into a phone. The menu fell off. Build the frame. Write the captions. LinkedIn is on mute.",
  },
  {
    id: "close",
    from: 1_860,
    durationInFrames: 240,
    kicker: "What I would not repeat",
    caption: "Map it. Then fix what you can see.",
    captionLine2: "Relocate smarter. Settle faster. Thrive longer.",
    voice: "Map it. Then fix what you can actually see. Relocate smarter. Settle faster. Thrive longer.",
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
