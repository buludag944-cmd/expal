export type JourneyBeatId = "welcome" | "map" | "layout" | "backend" | "close";

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
    durationInFrames: 240,
    kicker: "Vibe-coder's journey",
    caption: "Welcome to Vibe-coder's Journey.",
    captionLine2: "The map, the phone, and the backend.",
    voice: "Welcome to Vibe-coder's Journey. How I mapped EXPal, the phone layout, and the backend.",
  },
  {
    id: "map",
    from: 240,
    durationInFrames: 540,
    kicker: "01 · The feature map",
    caption: "I mapped the product before the screens.",
    captionLine2: "Housing, visa, PPS, community, referrals.",
    voice:
      "I mapped the product before the screens. A public page, no login, and a journal I can post. Then the move itself. Housing. Visa and IRP. PPS. Community. Referrals. A job tracker. Home, Explore, Community, Journey, Profile.",
  },
  {
    id: "layout",
    from: 780,
    durationInFrames: 540,
    kicker: "02 · Phone vs desktop",
    caption: "Desktop was fine. The phone wasn't.",
    captionLine2: "I pinned it to the screen you can see.",
    voice:
      "Desktop was fine. The phone wasn't. Job tracker popups opened off the page. On the phone, forms hid under the tabs, and chat covered Send. I pinned them to the screen you can actually see.",
  },
  {
    id: "backend",
    from: 1_320,
    durationInFrames: 540,
    kicker: "03 · The backend",
    caption: "Accounts vanished on every redeploy.",
    captionLine2: "A real database. The profile comes back.",
    voice:
      "Then the backend. Accounts disappeared every time I redeployed. I put them in a real database, so a restart doesn't wipe anyone. Google sign-in also forgot the profile. I read it back after login.",
  },
  {
    id: "close",
    from: 1_860,
    durationInFrames: 240,
    kicker: "What held",
    caption: "Map. Phone. Server.",
    captionLine2: "Relocate smarter. Settle faster. Thrive longer.",
    voice: "That's the map, the phone, and the server. Relocate smarter. Settle faster. Thrive longer.",
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
