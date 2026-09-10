export type LinkedInAdBeatKind = "hook" | "phone" | "cta";

export type LinkedInAdBeat = {
  id: string;
  startMs: number;
  endMs: number;
  kind: LinkedInAdBeatKind;
  shot?: string;
  caption: string;
  captionLine2?: string;
};

/** 56s LinkedIn product ad (4:5). Timed to the full marketing transcript. */
export const LINKEDIN_AD_DURATION_MS = 56_000;

export const LINKEDIN_AD_BEATS: LinkedInAdBeat[] = [
  {
    id: "hook",
    startMs: 0,
    endMs: 7_200,
    kind: "hook",
    caption: "Moving to a new country shouldn’t mean",
    captionLine2: "twenty-five open tabs and endless unanswered questions.",
  },
  {
    id: "meet",
    startMs: 7_200,
    endMs: 13_200,
    kind: "hook",
    caption: "Meet EXPal — built to make",
    captionLine2: "moving to and settling in Ireland simpler.",
  },
  {
    id: "home",
    startMs: 13_200,
    endMs: 21_800,
    kind: "phone",
    shot: "/story/home.jpg",
    caption: "Find practical guidance on PPS, IRP,",
    captionLine2: "housing, banking and employment rights.",
  },
  {
    id: "explore",
    startMs: 21_800,
    endMs: 32_400,
    kind: "phone",
    shot: "/story/explore.jpg",
    caption: "Connect directly with other expats.",
    captionLine2: "Ask questions, build your network, request referrals.",
  },
  {
    id: "journey",
    startMs: 32_400,
    endMs: 39_600,
    kind: "phone",
    shot: "/story/journey.jpg",
    caption: "Soon, you’ll also be able to track",
    captionLine2: "important document and IRP renewal dates.",
  },
  {
    id: "profile",
    startMs: 39_600,
    endMs: 48_400,
    kind: "phone",
    shot: "/story/profile.jpg",
    caption: "No ads. No noise.",
    captionLine2: "Just guidance, connection and community.",
  },
  {
    id: "cta",
    startMs: 48_400,
    endMs: 56_000,
    kind: "cta",
    caption: "EXPal. Move. Settle. Connect.",
  },
];

export function linkedInAdBeatAt(ms: number): LinkedInAdBeat {
  const clamped = Math.max(0, Math.min(ms, LINKEDIN_AD_DURATION_MS - 1));
  return (
    LINKEDIN_AD_BEATS.find((beat) => clamped >= beat.startMs && clamped < beat.endMs) ??
    LINKEDIN_AD_BEATS[LINKEDIN_AD_BEATS.length - 1]
  );
}

export function linkedInAdHomeAppearances(): number {
  return LINKEDIN_AD_BEATS.filter((beat) => beat.kind === "phone" && beat.id === "home").length;
}
