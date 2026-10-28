export type JourneyVisualId =
  | "phone"
  | "visa"
  | "community"
  | "map"
  | "covered"
  | "hero"
  | "features"
  | "journal"
  | "login"
  | "pair";

export type JourneyVisual = {
  kind: "phone" | "card" | "pair";
  src: string;
  src2?: string;
  /** CSS object-position for phone screenshots. */
  position?: string;
  /** Source width / height, so the card shows the whole screenshot. */
  aspect?: number;
};

export type JourneyBeat = {
  id: string;
  visual: JourneyVisualId;
  from: number;
  durationInFrames: number;
  /** First frame of this picture, shared across caption changes. */
  visualFrom: number;
  caption: string;
  captionLine2: string;
};

export const JOURNEY_FPS = 30;
/** LinkedIn 4:5. Captions stay inside the frame. */
export const JOURNEY_WIDTH = 1080;
export const JOURNEY_HEIGHT = 1350;
/** Cleaned recording, after the restart false starts are removed. */
export const JOURNEY_DURATION_SEC = 140.8;

/**
 * Product screenshots only. No profile, no home greeting, no account email.
 * Phone shots are the app. Desktop shots are the public site and Google sign-in.
 */
export const JOURNEY_VISUALS: Record<JourneyVisualId, JourneyVisual> = {
  phone: { kind: "phone", src: "story/explore.jpg", position: "top" },
  visa: { kind: "phone", src: "story/journey.jpg", position: "top" },
  community: { kind: "phone", src: "journey/phone-community.png", position: "top" },
  map: { kind: "card", src: "journey/phone-map.jpg", aspect: 924 / 520 },
  covered: { kind: "card", src: "journey/phone-covered.jpg", aspect: 966 / 780 },
  hero: { kind: "card", src: "journey/desktop-hero.png", aspect: 1280 / 615 },
  features: { kind: "card", src: "journey/desktop-features.png", aspect: 1280 / 581 },
  journal: { kind: "card", src: "journey/desktop-journal.png", aspect: 1280 / 860 },
  login: { kind: "card", src: "journey/desktop-login.png", aspect: 1100 / 640 },
  pair: {
    kind: "pair",
    src: "journey/desktop-hero.png",
    src2: "story/explore.jpg",
  },
};

const ROWS: Array<{
  t: number;
  id: string;
  visual: JourneyVisualId;
  caption: string;
  captionLine2?: string;
}> = [
  { t: 0, id: "welcome", visual: "phone", caption: "Hello. Welcome to Vibe-coder's Journey." },
  { t: 4.08, id: "series", visual: "phone", caption: "A tutorial series about building EXPal." },
  { t: 9.34, id: "ireland", visual: "hero", caption: "A relocation guide for expats in Ireland." },
  { t: 12.66, id: "bugs", visual: "phone", caption: "The bugs I faced, and how I fixed them." },
  {
    t: 20.42,
    id: "roadmap",
    visual: "map",
    caption: "First: how I mapped EXPal.",
    captionLine2: "The phone layout, and the backend.",
  },
  { t: 29.86, id: "before", visual: "features", caption: "I mapped the product before the screens." },
  { t: 33.6, id: "public", visual: "hero", caption: "A public page. No login." },
  { t: 36.5, id: "journal", visual: "journal", caption: "And a journal I can post." },
  { t: 38.28, id: "housing", visual: "phone", caption: "Then the move itself. Housing." },
  { t: 42.18, id: "visa", visual: "visa", caption: "Visa, IRP, and PPS." },
  { t: 46, id: "community", visual: "community", caption: "Community was the most important part." },
  { t: 50.22, id: "referrals", visual: "phone", caption: "Along with referrals." },
  { t: 52.54, id: "jobs", visual: "phone", caption: "Then a job tracker." },
  {
    t: 54.44,
    id: "tabs",
    visual: "phone",
    caption: "Home, Explore, Community, Journey, Profile.",
  },
  { t: 61.88, id: "layout", visual: "pair", caption: "The second problem was the layout." },
  { t: 64.86, id: "desktop", visual: "pair", caption: "Desktop was fine. The phone wasn't." },
  { t: 68.46, id: "popups", visual: "covered", caption: "Job tracker pop-ups opened off the page." },
  {
    t: 71.84,
    id: "forms",
    visual: "covered",
    caption: "Forms hid under the tabs. Chat covered Send.",
  },
  {
    t: 77.2,
    id: "pinned",
    visual: "phone",
    caption: "I pinned them to the screen you can actually see.",
  },
  {
    t: 82.42,
    id: "backend",
    visual: "login",
    caption: "Then the backend.",
    captionLine2: "The crucial problem if you don't know how to code.",
  },
  { t: 90.62, id: "accounts", visual: "login", caption: "Accounts disappeared every time I redeployed." },
  { t: 93.9, id: "database", visual: "login", caption: "I put them in a real database." },
  { t: 96.24, id: "restart", visual: "login", caption: "So a restart doesn't wipe anymore." },
  { t: 101.64, id: "google", visual: "login", caption: "Google sign-in was the part I forgot to add." },
  {
    t: 107.36,
    id: "firebase",
    visual: "login",
    caption: "I learned how to add Firebase.",
    captionLine2: "So people can sign in with their Google accounts.",
  },
  { t: 120.82, id: "close", visual: "pair", caption: "That's the map, the phone, and the server." },
  { t: 124.66, id: "continue", visual: "community", caption: "I'll continue this series." },
  { t: 129.74, id: "idea", visual: "phone", caption: "Building an app starts with an easy idea." },
  {
    t: 134.1,
    id: "motto",
    visual: "hero",
    caption: "EXPal.",
    captionLine2: "Relocate smarter. Settle faster. Thrive longer.",
  },
];

function frameAt(seconds: number): number {
  return Math.round(seconds * JOURNEY_FPS);
}

function buildBeats(): JourneyBeat[] {
  let visualFrom = 0;
  let previousVisual: JourneyVisualId | null = null;
  return ROWS.map((row, index) => {
    const from = frameAt(row.t);
    const end = frameAt(ROWS[index + 1]?.t ?? JOURNEY_DURATION_SEC);
    if (row.visual !== previousVisual) {
      visualFrom = from;
      previousVisual = row.visual;
    }
    return {
      id: row.id,
      visual: row.visual,
      from,
      durationInFrames: end - from,
      visualFrom,
      caption: row.caption,
      captionLine2: row.captionLine2 ?? "",
    };
  });
}

export const JOURNEY_BEATS: JourneyBeat[] = buildBeats();

export const JOURNEY_DURATION_IN_FRAMES = frameAt(JOURNEY_DURATION_SEC);
export const JOURNEY_DURATION_MS = (JOURNEY_DURATION_IN_FRAMES / JOURNEY_FPS) * 1000;

export function journeyBeatAtFrame(frame: number): JourneyBeat {
  const clamped = Math.max(0, Math.min(frame, JOURNEY_DURATION_IN_FRAMES - 1));
  return (
    JOURNEY_BEATS.find(
      (beat) => clamped >= beat.from && clamped < beat.from + beat.durationInFrames,
    ) ?? JOURNEY_BEATS[JOURNEY_BEATS.length - 1]
  );
}
