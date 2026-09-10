export type ShortBeatKind = "hook" | "phone" | "cta";

export type ShortBeat = {
  id: string;
  from: number;
  durationInFrames: number;
  kind: ShortBeatKind;
  shot?: string;
  caption: string;
  captionLine2?: string;
  voice: string;
};

export const SHORT_FPS = 30;
export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;

/** ~1s of air before the first sentence of each beat. */
export const TTS_LEAD_IN_MS = 1_000;
/** Pause between sentences inside a beat (0.4–0.7s). */
export const TTS_BETWEEN_SENTENCES_MS = 550;

/** 53s 9:16 cut: visuals hold for TTS lead-in and sentence gaps. */
export const SHORT_DURATION_IN_FRAMES = 1_590;
export const SHORT_DURATION_MS = (SHORT_DURATION_IN_FRAMES / SHORT_FPS) * 1000;

export function splitVoiceSentences(text: string): string[] {
  return text
    .split(/(?<=[.?!])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export const SHORT_BEATS: ShortBeat[] = [
  {
    id: "hook",
    from: 0,
    durationInFrames: 240,
    kind: "hook",
    caption: "Moving to a new country shouldn’t mean",
    captionLine2: "twenty-five open tabs and endless unanswered questions.",
    voice:
      "Moving to a new country shouldn’t mean twenty-five open tabs and endless unanswered questions.",
  },
  {
    id: "meet",
    from: 240,
    durationInFrames: 210,
    kind: "hook",
    caption: "Meet EXPal — built to make",
    captionLine2: "moving to and settling in Ireland simpler.",
    voice: "Meet EXPal — built to make moving to and settling in Ireland simpler.",
  },
  {
    id: "home",
    from: 450,
    durationInFrames: 270,
    kind: "phone",
    shot: "story/home.jpg",
    caption: "Find practical guidance on PPS, IRP,",
    captionLine2: "housing, banking and employment rights.",
    voice: "Find practical guidance on PPS, IRP, housing, banking and employment rights.",
  },
  {
    id: "explore",
    from: 720,
    durationInFrames: 240,
    kind: "phone",
    shot: "story/explore.jpg",
    caption: "Connect directly with other expats.",
    captionLine2: "Ask questions, build your network, request referrals.",
    voice: "Connect with other expats, ask questions, and request career referrals.",
  },
  {
    id: "profile",
    from: 960,
    durationInFrames: 330,
    kind: "phone",
    shot: "story/profile.jpg",
    caption: "No ads. No noise.",
    captionLine2: "Just guidance, connection and community.",
    voice: "No ads. No noise. Just guidance, connection and community.",
  },
  {
    id: "cta",
    from: 1_290,
    durationInFrames: 300,
    kind: "cta",
    caption: "Relocate smarter, settle faster",
    captionLine2: "and thrive longer.",
    voice: "EXPal. Relocate smarter, settle faster and thrive longer.",
  },
];

export function shortBeatAtFrame(frame: number): ShortBeat {
  const clamped = Math.max(0, Math.min(frame, SHORT_DURATION_IN_FRAMES - 1));
  return (
    SHORT_BEATS.find(
      (beat) => clamped >= beat.from && clamped < beat.from + beat.durationInFrames,
    ) ?? SHORT_BEATS[SHORT_BEATS.length - 1]
  );
}

export function shortBeatStartMs(beat: ShortBeat): number {
  return (beat.from / SHORT_FPS) * 1000;
}
