export type JourneyBeatId = "welcome" | "login" | "profile" | "layout" | "close";

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
    id: "welcome",
    from: 0,
    durationInFrames: 330,
    kicker: "Vibe-coder's journey",
    caption: "Welcome to Vibe-coder's Journey.",
    captionLine2: "How I built my app, and the problems I faced.",
    voice:
      "Welcome to Vibe-coder's Journey. A series on how I built my app, and the problems I faced.",
  },
  {
    id: "login",
    from: 330,
    durationInFrames: 510,
    kicker: "Problem 01 · The door",
    caption: "Problem: everyone hit login.",
    captionLine2: "Fix: the journal stays open.",
    voice:
      "First problem. The old site threw everyone onto login. If you can't land, you can't be found. I fixed that. The journal stays open. You make an account when you want one.",
  },
  {
    id: "profile",
    from: 840,
    durationInFrames: 510,
    kicker: "Problem 02 · The profile",
    caption: "Problem: Gmail was the profile.",
    captionLine2: "Fix: Dublin, and a work permit.",
    voice:
      "Second problem. My Gmail was on the profile. I took it off. People see Dublin, and a work permit. And I cut the line the real screen never had.",
  },
  {
    id: "layout",
    from: 1_350,
    durationInFrames: 480,
    kicker: "Problem 03 · The frame",
    caption: "Problem: the menu fell off the phone.",
    captionLine2: "Fix: I built the frame, and the captions.",
    voice:
      "Third problem. I squeezed a wide video into a phone, and the menu fell off. I built the frame, and I wrote the captions on. LinkedIn is on mute.",
  },
  {
    id: "close",
    from: 1_830,
    durationInFrames: 270,
    kicker: "How I fixed them",
    caption: "Three problems. Three fixes.",
    captionLine2: "Relocate smarter. Settle faster. Thrive longer.",
    voice: "Three problems. Three fixes. Relocate smarter. Settle faster. Thrive longer.",
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
