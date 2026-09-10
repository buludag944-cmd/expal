import type { Overlay, Tab } from "./ExpalApp";

export type AdBeatKind = "hook" | "phone" | "cta";

export type AdBeat = {
  id: string;
  startMs: number;
  endMs: number;
  kind: AdBeatKind;
  tab?: Tab;
  overlay?: Overlay | null;
  caption: string;
};

/** 28s Play / TikTok / Instagram cut. Home appears once (reveal). */
export const AD_DURATION_MS = 28_000;

export const AD_BEATS: AdBeat[] = [
  {
    id: "hook-a",
    startMs: 0,
    endMs: 1_400,
    kind: "hook",
    caption: "Moving to Ireland?",
  },
  {
    id: "hook-b",
    startMs: 1_400,
    endMs: 3_000,
    kind: "hook",
    caption: "You're about to open 20 tabs",
  },
  {
    id: "reveal",
    startMs: 3_000,
    endMs: 6_500,
    kind: "phone",
    tab: "home",
    overlay: null,
    caption: "EXPal puts it all in one place",
  },
  {
    id: "housing",
    startMs: 6_500,
    endMs: 11_500,
    kind: "phone",
    tab: "home",
    overlay: "housing",
    caption: "Southside rooms under €1,000",
  },
  {
    id: "community",
    startMs: 11_500,
    endMs: 16_500,
    kind: "phone",
    tab: "community",
    overlay: null,
    caption: "PPS wait times — real workarounds",
  },
  {
    id: "knowhow",
    startMs: 16_500,
    endMs: 22_000,
    kind: "phone",
    tab: "explore",
    overlay: "knowhow",
    caption: "Leap card on day one",
  },
  {
    id: "cta",
    startMs: 22_000,
    endMs: 28_000,
    kind: "cta",
    caption: "Download EXPal free",
  },
];

export function beatAt(ms: number): AdBeat {
  const clamped = Math.max(0, Math.min(ms, AD_DURATION_MS - 1));
  return AD_BEATS.find((beat) => clamped >= beat.startMs && clamped < beat.endMs) ?? AD_BEATS[AD_BEATS.length - 1];
}

export function homeAppearances(): number {
  return AD_BEATS.filter((beat) => beat.kind === "phone" && beat.tab === "home" && !beat.overlay).length;
}

export function phoneScreenKey(beat: AdBeat): string {
  if (beat.kind !== "phone") return beat.kind;
  return `${beat.tab}-${beat.overlay ?? "none"}`;
}
