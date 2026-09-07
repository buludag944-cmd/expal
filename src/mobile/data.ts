export const ARRIVAL_ISO = "2026-05-23";
export const PR_YEARS = 5;

export function startOfDay(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysBetween(fromIso: string, to: Date = new Date()): number {
  const [year, month, day] = fromIso.split("-").map(Number);
  const from = Date.UTC(year, month - 1, day);
  return Math.max(0, Math.round((startOfDay(to) - from) / 86_400_000));
}

export function addYears(iso: string, years: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${year + years}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatDayCount(n: number): string {
  return n.toLocaleString("en-IE");
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function visaProgress(daysHere: number): {
  percent: number;
  daysToPr: number;
  prDate: string;
} {
  const total = PR_YEARS * 365;
  const daysToPr = Math.max(0, total - daysHere);
  const percent = Math.min(100, Math.round((daysHere / total) * 100));
  return { percent, daysToPr, prDate: addYears(ARRIVAL_ISO, PR_YEARS) };
}

export const USER = {
  firstName: "Bahar",
  lastName: "Uludag",
  city: "Dublin",
  country: "Ireland",
  permit: "Work Permit",
  job: "Account Management",
  arrivalLabel: "Since May 2026",
};

export const DEADLINES = [
  {
    id: "sim",
    title: "Get a local SIM card",
    detail: "Set up a local number for banking and admin.",
    due: "2026-06-01",
    done: false,
  },
  {
    id: "address",
    title: "Register address with local authority",
    detail: "Complete required registration for your visa.",
    due: "2026-06-07",
    done: false,
  },
  {
    id: "gp",
    title: "Register with a GP / health centre",
    detail: "Enrol in local healthcare if applicable.",
    due: "2026-06-14",
    done: false,
  },
  {
    id: "pps",
    title: "Apply for tax number",
    detail: "Get your local tax ID (PPS, Steuer-ID, etc.).",
    due: "2026-06-21",
    done: false,
  },
  {
    id: "bank",
    title: "Open a local bank account",
    detail: "Needed for rent, salary, and most Irish admin.",
    due: "2026-06-28",
    done: false,
  },
];

export const COMPLETED_STEPS = [
  { id: "permit", title: "Work permit issued", detail: "Critical Skills / work permission on file." },
  { id: "flight", title: "Arrived in Dublin", detail: "Landing recorded for the Stamp journey." },
  { id: "pps-prep", title: "Gathered PPS documents", detail: "Passport, proof of address, employment letter." },
  { id: "irp-read", title: "Read the IRP booking guide", detail: "Burgh Quay first-time registration notes." },
  { id: "tax-guide", title: "Saved the tax residency explainer", detail: "From the EXPal journal." },
  { id: "profile", title: "Completed EXPal profile", detail: "Dublin · Work Permit · Account Management." },
];

export const HOUSING = [
  {
    id: "rathmines",
    title: "Room in Rathmines",
    meta: "€950 / month · bills extra",
    tag: "Expat-friendly",
    detail: "Double room, 12-min Luas, landlord used to Stamp 1 references.",
  },
  {
    id: "drumcondra",
    title: "Studio in Drumcondra",
    meta: "€1,450 / month · incl. wifi",
    tag: "Near Dart",
    detail: "Furnished, available mid-month, no Irish guarantor required.",
  },
  {
    id: "ranelagh",
    title: "Shared house in Ranelagh",
    meta: "€875 / month · 4 housemates",
    tag: "Newcomer mix",
    detail: "Quiet house, two other recent arrivals, garden, bike storage.",
  },
];

export const EVENTS = [
  {
    id: "irish-cafe",
    title: "Irish conversation café",
    meta: "Fri 17 Jul · The Complex, Smithfield",
    detail: "Beginner-friendly Irish and English mix. No grammar homework.",
  },
  {
    id: "pps-clinic",
    title: "PPS & banking clinic",
    meta: "Sun 19 Jul · ILAC Centre",
    detail: "Bring your passport. Volunteers walk through the forms with you.",
  },
  {
    id: "picnic",
    title: "Dublin newcomers picnic",
    meta: "Sat 25 Jul · Herbert Park",
    detail: "Blankets, tea, and people who also arrived this year.",
  },
];

export const THREADS = [
  {
    id: "dublin-expats",
    title: "Expat community in Dublin",
    meta: "128 members · active today",
    detail: "Join threads and events nearby.",
  },
  {
    id: "pps-wait",
    title: "PPS number wait times right now",
    meta: "32 replies · this week",
    detail: "People sharing appointment screenshots and workarounds.",
  },
  {
    id: "southside-rooms",
    title: "Southside rooms under €1,000",
    meta: "Housing · 18 replies",
    detail: "Lived listings, not Facebook spam.",
  },
];

export const REFERRALS = [
  {
    id: "google",
    title: "Aylin K. · Google Ireland",
    meta: "Programmatic · Dublin",
    detail: "Open to a warm intro if you send a specific role link.",
  },
  {
    id: "accenture",
    title: "James O. · Accenture",
    meta: "Consulting · Dublin",
    detail: "Happy to refer for sales and account roles.",
  },
  {
    id: "stripe",
    title: "Marta R. · Stripe",
    meta: "Support · remote-friendly",
    detail: "Prefers a short note about why the team, not a cold CV dump.",
  },
];

export const SEARCH_HITS = [
  { id: "s1", kind: "Member", title: "Aylin K.", detail: "Google Ireland · Dublin" },
  { id: "s2", kind: "Member", title: "James O.", detail: "Accenture · referrals" },
  { id: "s3", kind: "Topic", title: "PPS number", detail: "Tax ID, appointments, documents" },
  { id: "s4", kind: "Topic", title: "IRP registration", detail: "Burgh Quay · first appointment" },
  { id: "s5", kind: "Topic", title: "Rathmines rooms", detail: "Housing with expat-friendly filters" },
];

export const KNOW_HOW = [
  { id: "leap", title: "Get a Leap card on day one", detail: "Buses and Luas before you even unpack." },
  { id: "bin", title: "Bins, TVs, and the household tax", detail: "The unglamorous admin nobody warns you about." },
  { id: "gp", title: "Finding a GP who still takes patients", detail: "Start with your Eircode, not Google Maps." },
];

export const ESSENTIALS = [
  { id: "visa", title: "Visa & Stamp pathway", detail: "What a job change can mean for permission to stay." },
  { id: "tax", title: "Tax residency in plain English", detail: "PPS, Revenue, and your first Irish paycheck." },
  { id: "bank", title: "Banking without an Irish trail", detail: "Which documents actually get an account opened." },
];

export const VAULT = [
  { id: "passport", title: "Passport", meta: "PDF · uploaded" },
  { id: "permit-doc", title: "Work permit", meta: "PDF · uploaded" },
  { id: "contract", title: "Employment contract", meta: "PDF · uploaded" },
  { id: "irp", title: "IRP appointment letter", meta: "Waiting on booking" },
];

export const RIGHTS = [
  { id: "hours", title: "Hours and rest breaks", detail: "Irish working-time basics for employees." },
  { id: "notice", title: "Notice when a contract ends", detail: "What you are owed, and what to ask in writing." },
  { id: "stamp", title: "Job change and your Stamp", detail: "Do not guess — check the permission before you resign." },
];
