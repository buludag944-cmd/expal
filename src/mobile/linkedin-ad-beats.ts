export type LinkedInAdBeatKind = "hook" | "phone" | "cta";

export type LinkedInAdBeat = {
  id: string;
  startMs: number;
  endMs: number;
  kind: LinkedInAdBeatKind;
  shot?: string;
  caption: string;
};

/** 36s LinkedIn product ad (4:5). Feature names only — not screenshot copy. */
export const LINKEDIN_AD_DURATION_MS = 36_000;

export const LINKEDIN_AD_BEATS: LinkedInAdBeat[] = [
  {
    id: "hook",
    startMs: 0,
    endMs: 4_000,
    kind: "hook",
    caption: "Moving to Ireland?",
  },
  {
    id: "home",
    startMs: 4_000,
    endMs: 10_000,
    kind: "phone",
    shot: "/story/home.jpg",
    caption: "Home",
  },
  {
    id: "explore",
    startMs: 10_000,
    endMs: 16_000,
    kind: "phone",
    shot: "/story/explore.jpg",
    caption: "Explore",
  },
  {
    id: "journey",
    startMs: 16_000,
    endMs: 22_000,
    kind: "phone",
    shot: "/story/journey.jpg",
    caption: "Journey",
  },
  {
    id: "profile",
    startMs: 22_000,
    endMs: 28_000,
    kind: "phone",
    shot: "/story/profile.jpg",
    caption: "Profile",
  },
  {
    id: "cta",
    startMs: 28_000,
    endMs: 36_000,
    kind: "cta",
    caption: "Download EXPal free",
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
