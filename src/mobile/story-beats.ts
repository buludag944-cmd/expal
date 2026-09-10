export type StoryBeatKind = "card" | "phone" | "close";

export type StoryBeat = {
  id: string;
  startMs: number;
  endMs: number;
  kind: StoryBeatKind;
  kicker?: string;
  lines?: string[];
  /** Live App Store screenshot shown inside the phone frame. */
  shot?: string;
  /** Burned-in line for phone beats; unused on cards (the card is the copy). */
  caption: string;
  captionLine2?: string;
};

/** 58s LinkedIn personal story. 4:5. Each live screenshot appears once. */
export const STORY_DURATION_MS = 58_000;

export const STORY_BEATS: StoryBeat[] = [
  {
    id: "hook",
    startMs: 0,
    endMs: 5_000,
    kind: "card",
    kicker: "Dublin",
    lines: [
      "I moved to Dublin for work and spent my first month with 20 browser tabs open just trying to figure out my PPS number.",
    ],
    caption: "I moved to Dublin for work",
  },
  {
    id: "turn-a",
    startMs: 5_000,
    endMs: 10_000,
    kind: "card",
    lines: ["I come from a marketing and AdTech background — not engineering."],
    caption: "Marketing and AdTech — not engineering",
  },
  {
    id: "turn-b",
    startMs: 10_000,
    endMs: 15_000,
    kind: "card",
    lines: [
      "I kept thinking: this should exist.",
      "So I built it myself, using Claude and Cursor.",
    ],
    caption: "So I built it myself",
  },
  {
    id: "home",
    startMs: 15_000,
    endMs: 22_500,
    kind: "phone",
    shot: "/story/home.jpg",
    caption: "107 days in Dublin",
    captionLine2: "This is the app I actually use.",
  },
  {
    id: "explore",
    startMs: 22_500,
    endMs: 30_000,
    kind: "phone",
    shot: "/story/explore.jpg",
    caption: "One list, not 20 tabs",
    captionLine2: "Housing, visa, Leap card.",
  },
  {
    id: "journey",
    startMs: 30_000,
    endMs: 37_500,
    kind: "phone",
    shot: "/story/journey.jpg",
    caption: "The tracker I needed on day one",
    captionLine2: "PPS, GP, tax — on a timeline.",
  },
  {
    id: "profile",
    startMs: 37_500,
    endMs: 45_000,
    kind: "phone",
    shot: "/story/profile.jpg",
    caption: "My Dublin identity",
    captionLine2: "City and permit — not just an email.",
  },
  {
    id: "close-copy",
    startMs: 45_000,
    endMs: 52_000,
    kind: "card",
    lines: [
      "EXPal is live on the App Store and Google Play.",
      "If you're building something with AI tools, or moving to Ireland yourself — I'd love to connect.",
    ],
    caption: "I'd love to connect",
  },
  {
    id: "close-logo",
    startMs: 52_000,
    endMs: 58_000,
    kind: "close",
    caption: "Bahar Uludag · EXPal",
  },
];

export function storyBeatAt(ms: number): StoryBeat {
  const clamped = Math.max(0, Math.min(ms, STORY_DURATION_MS - 1));
  return (
    STORY_BEATS.find((beat) => clamped >= beat.startMs && clamped < beat.endMs) ??
    STORY_BEATS[STORY_BEATS.length - 1]
  );
}

export function storyHomeAppearances(): number {
  return STORY_BEATS.filter((beat) => beat.kind === "phone" && beat.id === "home").length;
}

export function storyPhoneKey(beat: StoryBeat): string {
  if (beat.kind !== "phone") return beat.kind;
  return beat.id;
}
