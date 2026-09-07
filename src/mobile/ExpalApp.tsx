"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ARRIVAL_ISO,
  COMPLETED_STEPS,
  DEADLINES,
  ESSENTIALS,
  EVENTS,
  HOUSING,
  KNOW_HOW,
  REFERRALS,
  RIGHTS,
  SEARCH_HITS,
  THREADS,
  USER,
  VAULT,
  daysBetween,
  formatDayCount,
  greetingForHour,
  visaProgress,
} from "./data";
import {
  AvatarScene,
  BackIcon,
  BellIcon,
  BooksIcon,
  BriefcaseIcon,
  BulbIcon,
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  ChevronIcon,
  CompassIcon,
  FabChatIcon,
  HelpIcon,
  HomeTabIcon,
  HouseIcon,
  IdCardIcon,
  LockIcon,
  MailboxIcon,
  MembersIcon,
  PencilIcon,
  PeopleIcon,
  ProfileTabIcon,
  ScalesIcon,
  SearchIcon,
} from "./icons";
import "./expal-app.css";

export type AppCaption = { kicker: string; body: string };

type Tab = "home" | "explore" | "community" | "journey" | "profile";
type Overlay =
  | "housing"
  | "events"
  | "referrals"
  | "messages"
  | "rights"
  | "help"
  | "members"
  | "knowhow"
  | "essentials"
  | "task"
  | "notifications"
  | "search"
  | "edit-profile"
  | "privacy"
  | "inbox"
  | "thread";

const TAB_CAPTIONS: Record<Tab, AppCaption> = {
  home: {
    kicker: "Home",
    body: "Days in Dublin, visa pathway, and the tasks that still need doing.",
  },
  explore: {
    kicker: "Explore",
    body: "Events, housing, local know-how, and visa guides — picked for this phase.",
  },
  community: {
    kicker: "Community",
    body: "Threads and people nearby, so Dublin is not ten WhatsApp groups.",
  },
  journey: {
    kicker: "Journey",
    body: "Work permit progress, days to PR, and the admin checklist after landing.",
  },
  profile: {
    kicker: "Profile",
    body: "Permit details, alerts, and the Dublin identity you are building here.",
  },
};

const OVERLAY_CAPTIONS: Partial<Record<Overlay, AppCaption>> = {
  housing: { kicker: "Housing", body: "Listings with expat-friendly filters — no Irish guarantor required." },
  events: { kicker: "Events", body: "Language cafés, PPS clinics, and newcomer meetups this month." },
  referrals: { kicker: "Referrals", body: "Warm intros to people already inside the companies you want." },
  messages: { kicker: "Messages", body: "Direct notes from members who offered help." },
  rights: { kicker: "Rights", body: "Hours, notice, and what a job change can mean for your Stamp." },
  help: { kicker: "Help", body: "Ask EXPal about PPS, IRP, banking, or the first weeks in Dublin." },
  members: { kicker: "Members", body: "People already settled who remember what this stage feels like." },
  knowhow: { kicker: "Local know-how", body: "Leap cards, GPs, bins — the daily-life shortcuts." },
  essentials: { kicker: "Expat essentials", body: "Visa, tax, and banking guides in one shelf." },
  task: { kicker: "Checklist", body: "A concrete next step, with a date, so the admin cannot hide." },
  notifications: { kicker: "Alerts", body: "Deadlines and community nudges before they become emergencies." },
  search: { kicker: "Search", body: "Find members or topics — PPS, housing, IRP — in one field." },
  inbox: { kicker: "Inbox", body: "Push alerts and messages in one quiet list." },
  privacy: { kicker: "Privacy", body: "Your permit and documents stay in your vault." },
  "edit-profile": { kicker: "Edit profile", body: "City, permit type, and the work you do here." },
  thread: { kicker: "Community", body: "Join the Dublin thread and the events happening nearby." },
};

function Tile({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span className="tile" style={{ background: bg }}>
      {children}
    </span>
  );
}

function StatusBar({ light }: { light?: boolean }) {
  const time = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-IE", { hour: "numeric", minute: "2-digit" });
  }, []);
  return (
    <div className="expal-status" style={{ color: light ? "white" : "#1c1c1e" }}>
      <span>{time}</span>
      <span className="expal-status-icons" aria-hidden="true">
        ▮▮▮▮ ☀︎ 🔋
      </span>
    </div>
  );
}

export default function ExpalApp({
  onCaption,
}: {
  onCaption?: (caption: AppCaption) => void;
}) {
  const [tab, setTab] = useState<Tab>("home");
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [journeyTab, setJourneyTab] = useState<"tracker" | "checklist" | "vault">("tracker");
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<(typeof DEADLINES)[number] | null>(null);
  const [search, setSearch] = useState("");
  const [pushOn, setPushOn] = useState(true);

  const daysHere = daysBetween(ARRIVAL_ISO);
  const progress = visaProgress(daysHere);
  const hour = new Date().getHours();
  const hello = greetingForHour(hour);

  useEffect(() => {
    const caption = overlay
      ? OVERLAY_CAPTIONS[overlay] || TAB_CAPTIONS[tab]
      : chatOpen
        ? { kicker: "Ask EXPal", body: "A red chat button for the questions that do not fit a form." }
        : tab === "journey"
          ? {
              kicker: journeyTab === "tracker" ? "Visa tracker" : journeyTab === "checklist" ? "Checklist" : "Vault",
              body:
                journeyTab === "tracker"
                  ? `${formatDayCount(daysHere)} days in Ireland, ${progress.percent}% of the way to PR.`
                  : journeyTab === "checklist"
                    ? "Open tasks with dates — SIM, address, GP, PPS."
                    : "Passport, permit, and contract stored with the journey.",
            }
          : TAB_CAPTIONS[tab];
    onCaption?.(caption);
  }, [tab, overlay, chatOpen, journeyTab, daysHere, progress.percent, onCaption]);

  const openTask = (task: (typeof DEADLINES)[number]) => {
    setActiveTask(task);
    setOverlay("task");
  };

  const goTab = (next: Tab) => {
    setOverlay(null);
    setChatOpen(false);
    setTab(next);
    if (next === "journey") setJourneyTab("tracker");
  };

  const lightStatus = tab === "home" && !overlay && !chatOpen
    ? true
    : tab === "profile" && !overlay && !chatOpen;

  return (
    <div className="expal-app" data-screen={overlay || tab}>
      <StatusBar light={Boolean(lightStatus)} />
      <div className="expal-screen">
        {overlay ? (
          <OverlayScreen
            overlay={overlay}
            task={activeTask}
            search={search}
            onSearch={setSearch}
            onBack={() => setOverlay(null)}
            onOpenTask={openTask}
            onOpen={(next) => setOverlay(next)}
          />
        ) : tab === "home" ? (
          <HomeScreen
            hello={hello}
            daysHere={daysHere}
            onSearch={() => setOverlay("search")}
            onNotify={() => setOverlay("notifications")}
            onProfile={() => goTab("profile")}
            onQuick={(id) => {
              if (id === "explore") goTab("explore");
              else if (id === "community") goTab("community");
              else if (id === "visa") goTab("journey");
              else setOverlay(id as Overlay);
            }}
            onTimeline={() => goTab("journey")}
            onAlert={(id) => {
              if (id === "sim") openTask(DEADLINES[0]);
              else {
                setTab("community");
                setOverlay("thread");
              }
            }}
          />
        ) : tab === "explore" ? (
          <ExploreScreen
            onOpen={(id) => {
              if (id === "visa") goTab("journey");
              else setOverlay(id);
            }}
          />
        ) : tab === "community" ? (
          <CommunityScreen onOpenThread={() => setOverlay("thread")} onEvents={() => setOverlay("events")} />
        ) : tab === "journey" ? (
          <JourneyScreen
            daysHere={daysHere}
            progress={progress}
            journeyTab={journeyTab}
            setJourneyTab={setJourneyTab}
            onOpenTask={openTask}
          />
        ) : (
          <ProfileScreen
            daysHere={daysHere}
            pushOn={pushOn}
            setPushOn={setPushOn}
            onOpen={(id) => {
              if (id === "visa") goTab("journey");
              else setOverlay(id);
            }}
          />
        )}
      </div>

      <button
        type="button"
        className="fab"
        aria-label="Open chat"
        onClick={() => setChatOpen(true)}
      >
        <FabChatIcon className="icon-svg" />
      </button>

      <nav className="tabbar" aria-label="Main">
        <TabButton label="Home" on={tab === "home" && !overlay} onClick={() => goTab("home")}>
          <HomeTabIcon className="icon-svg" active={tab === "home" && !overlay} />
        </TabButton>
        <TabButton label="Explore" on={tab === "explore" && !overlay} onClick={() => goTab("explore")}>
          <CompassIcon className="icon-svg" />
        </TabButton>
        <TabButton label="Community" on={tab === "community" && !overlay} onClick={() => goTab("community")}>
          <PeopleIcon className="icon-svg" />
        </TabButton>
        <TabButton label="Journey" on={tab === "journey" && !overlay} onClick={() => goTab("journey")}>
          <IdCardIcon className="icon-svg" />
        </TabButton>
        <TabButton label="Profile" on={tab === "profile" && !overlay} onClick={() => goTab("profile")}>
          <ProfileTabIcon className="icon-svg" active={tab === "profile"} />
        </TabButton>
      </nav>

      {chatOpen ? (
        <ChatSheet onClose={() => setChatOpen(false)} />
      ) : null}
    </div>
  );
}

function TabButton({
  label,
  on,
  onClick,
  children,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={on ? "on" : ""} onClick={onClick} aria-current={on ? "page" : undefined}>
      {children}
      {label}
    </button>
  );
}

function HomeScreen({
  hello,
  daysHere,
  onSearch,
  onNotify,
  onProfile,
  onQuick,
  onTimeline,
  onAlert,
}: {
  hello: string;
  daysHere: number;
  onSearch: () => void;
  onNotify: () => void;
  onProfile: () => void;
  onQuick: (id: string) => void;
  onTimeline: () => void;
  onAlert: (id: string) => void;
}) {
  const quick = [
    { id: "explore", label: "Explore", bg: "#dcedf8", icon: <CompassIcon className="icon-svg" /> },
    { id: "housing", label: "Housing", bg: "#f8e4e2", icon: <HouseIcon className="icon-svg" /> },
    { id: "community", label: "Community", bg: "#dceaf8", icon: <PeopleIcon className="icon-svg" /> },
    { id: "members", label: "Members", bg: "#f8efd2", icon: <MembersIcon className="icon-svg" /> },
    { id: "referrals", label: "Referrals", bg: "#f3e0cc", icon: <BriefcaseIcon className="icon-svg" /> },
    { id: "visa", label: "Visa", bg: "#e4e0f6", icon: <IdCardIcon className="icon-svg" /> },
    { id: "messages", label: "Messages", bg: "#dceaf8", icon: <ChatIcon className="icon-svg" /> },
    { id: "rights", label: "Rights", bg: "#ececef", icon: <ScalesIcon className="icon-svg" /> },
    { id: "events", label: "Events", bg: "#f8e4e2", icon: <CalendarIcon className="icon-svg" /> },
    { id: "help", label: "Help", bg: "#e3f3e4", icon: <HelpIcon className="icon-svg" /> },
  ];

  return (
    <>
      <section className="home-hero">
        <div className="home-top">
          <div>
            <p className="home-hello">{hello} 👋</p>
            <h1 className="home-title">Welcome back, {USER.firstName}.</h1>
          </div>
          <div className="home-tools">
            <button type="button" className="ghost-btn" aria-label="Notifications" onClick={onNotify}>
              <BellIcon className="icon-svg" />
            </button>
            <button type="button" className="ghost-btn" aria-label="Open profile" onClick={onProfile}>
              <ProfileTabIcon className="icon-svg" active />
            </button>
          </div>
        </div>
        <div className="home-stats">
          <article className="glass-card">
            <p className="k">Days in Dublin</p>
            <div className="v">{daysHere}</div>
            <p className="s">{USER.arrivalLabel}</p>
          </article>
          <article className="glass-card">
            <p className="k">Visa pathway</p>
            <div className="check-pill">
              <CheckIcon className="icon-svg" />
            </div>
            <p className="s">Set</p>
          </article>
          <article className="glass-card">
            <p className="k">Open tasks</p>
            <div className="v">3</div>
            <button type="button" className="linkish" onClick={onTimeline}>
              View timeline
            </button>
          </article>
        </div>
      </section>
      <div className="search-wrap">
        <SearchIcon className="search-icon" />
        <input
          readOnly
          placeholder="Search members or topics..."
          aria-label="Search members or topics"
          onClick={onSearch}
          onFocus={onSearch}
        />
      </div>
      <section className="section">
        <h2>Quick access</h2>
        <div className="quick-grid">
          {quick.map((item) => (
            <button key={item.id} type="button" className="quick-item" onClick={() => onQuick(item.id)}>
              <Tile bg={item.bg}>{item.icon}</Tile>
              {item.label}
            </button>
          ))}
        </div>
      </section>
      <section className="section" style={{ paddingBottom: 24 }}>
        <h2>Alerts for you</h2>
        <div className="alert-list">
          <button type="button" className="row" onClick={() => onAlert("sim")}>
            <span className="dot red" />
            <span className="row-copy">
              <span className="title">Get a local SIM card</span>
              <p className="sub">Due 2026-06-01</p>
            </span>
            <ChevronIcon className="chevron" />
          </button>
          <button type="button" className="row" onClick={() => onAlert("community")}>
            <span className="dot yellow" />
            <span className="row-copy">
              <span className="title">Expat community in Dublin</span>
              <p className="sub">Join threads and events nearby.</p>
            </span>
            <ChevronIcon className="chevron" />
          </button>
        </div>
      </section>
    </>
  );
}

function ExploreScreen({ onOpen }: { onOpen: (id: Overlay | "visa") => void }) {
  const items = [
    { id: "events" as const, title: "Events", sub: "Workshops and meetups", bg: "#fde8e4", icon: <CalendarIcon className="icon-svg" /> },
    { id: "housing" as const, title: "Housing", sub: "Listings and tips", bg: "#f8e4e2", icon: <HouseIcon className="icon-svg" /> },
    { id: "knowhow" as const, title: "Local Know-How", sub: "Daily life shortcuts", bg: "#f8efd2", icon: <BulbIcon className="icon-svg" /> },
    { id: "essentials" as const, title: "Expat Essentials", sub: "Visa, tax, banking guides", bg: "#e8f0e4", icon: <BooksIcon className="icon-svg" /> },
    { id: "referrals" as const, title: "Referrals", sub: "Jobs and introductions", bg: "#f3e0cc", icon: <BriefcaseIcon className="icon-svg" /> },
    { id: "visa" as const, title: "Visa & Permit", sub: "Timeline and IRP", bg: "#e4e0f6", icon: <IdCardIcon className="icon-svg" /> },
  ];
  return (
    <>
      <div className="page-head">
        <h1>Explore</h1>
      </div>
      <article className="hint-card">
        <p>Language and cultural events are a great fit now.</p>
        <div className="phase">
          <span className="dot blue" />
          Integration phase
        </div>
      </article>
      <section className="section">
        <h2>Discover</h2>
        <div className="row-list">
          {items.map((item) => (
            <button key={item.id} type="button" className="row" onClick={() => onOpen(item.id)}>
              <span className="icon-tile" style={{ background: item.bg }}>
                {item.icon}
              </span>
              <span className="row-copy">
                <span className="title">{item.title}</span>
                <p className="sub">{item.sub}</p>
              </span>
              <ChevronIcon className="chevron" />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function CommunityScreen({
  onOpenThread,
  onEvents,
}: {
  onOpenThread: () => void;
  onEvents: () => void;
}) {
  return (
    <>
      <div className="page-head">
        <h1>Community</h1>
      </div>
      <section className="section">
        <h2>Nearby</h2>
        <div className="row-list">
          {THREADS.map((thread) => (
            <button key={thread.id} type="button" className="row" onClick={onOpenThread}>
              <span className="dot yellow" />
              <span className="row-copy">
                <span className="title">{thread.title}</span>
                <p className="sub">{thread.meta}</p>
              </span>
              <ChevronIcon className="chevron" />
            </button>
          ))}
        </div>
      </section>
      <section className="section" style={{ paddingBottom: 24 }}>
        <h2>This week</h2>
        <div className="row-list">
          {EVENTS.slice(0, 2).map((event) => (
            <button key={event.id} type="button" className="row" onClick={onEvents}>
              <span className="icon-tile" style={{ background: "#fde8e4" }}>
                <CalendarIcon className="icon-svg" />
              </span>
              <span className="row-copy">
                <span className="title">{event.title}</span>
                <p className="sub">{event.meta}</p>
              </span>
              <ChevronIcon className="chevron" />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function JourneyScreen({
  daysHere,
  progress,
  journeyTab,
  setJourneyTab,
  onOpenTask,
}: {
  daysHere: number;
  progress: ReturnType<typeof visaProgress>;
  journeyTab: "tracker" | "checklist" | "vault";
  setJourneyTab: (tab: "tracker" | "checklist" | "vault") => void;
  onOpenTask: (task: (typeof DEADLINES)[number]) => void;
}) {
  return (
    <>
      <div className="page-head">
        <h1 style={{ fontSize: 22 }}>Visa & permit tracker</h1>
      </div>
      <div className="tabs">
        <button type="button" className={journeyTab === "tracker" ? "on" : ""} onClick={() => setJourneyTab("tracker")}>
          Tracker
        </button>
        <button type="button" className={journeyTab === "checklist" ? "on" : ""} onClick={() => setJourneyTab("checklist")}>
          Checklist
        </button>
        <button type="button" className={journeyTab === "vault" ? "on" : ""} onClick={() => setJourneyTab("vault")}>
          Vault
        </button>
      </div>
      {journeyTab === "tracker" ? (
        <>
          <article className="permit-card">
            <p className="k">Your permit</p>
            <h2>{USER.permit}</h2>
            <div className="progress" aria-label={`${progress.percent} percent to permanent residency`}>
              <span style={{ width: `${Math.max(progress.percent, 6)}%` }} />
            </div>
            <div className="progress-meta">
              <span>May 2026</span>
              <span>
                <b>{progress.percent}% to PR</b>
              </span>
              <span>Target</span>
            </div>
          </article>
          <div className="stat-grid">
            <article className="stat-card">
              <p className="k">Days in Ireland</p>
              <div className="v">{formatDayCount(daysHere)}</div>
              <p className="s">Since arrival</p>
            </article>
            <article className="stat-card">
              <p className="k">Days to PR</p>
              <div className="v">{formatDayCount(progress.daysToPr)}</div>
              <p className="s">5-year route</p>
            </article>
            <article className="stat-card">
              <p className="k">Open tasks</p>
              <div className="v">{DEADLINES.length}</div>
              <p className="s">On checklist</p>
            </article>
            <article className="stat-card">
              <p className="k">Completed</p>
              <div className="v">{COMPLETED_STEPS.length}</div>
              <p className="s">Steps done</p>
            </article>
          </div>
          <section className="section" style={{ paddingBottom: 24 }}>
            <h2>Key deadlines</h2>
            <div className="row-list">
              {DEADLINES.slice(0, 4).map((task) => (
                <button key={task.id} type="button" className="row" onClick={() => onOpenTask(task)}>
                  <span className="dot red" />
                  <span className="row-copy">
                    <span className="title">{task.title}</span>
                    <p className="sub">{task.detail}</p>
                  </span>
                  <span className="date-pill">{task.due}</span>
                </button>
              ))}
            </div>
          </section>
        </>
      ) : journeyTab === "checklist" ? (
        <section className="section" style={{ paddingBottom: 24, paddingTop: 12 }}>
          <div className="row-list">
            {DEADLINES.map((task) => (
              <button key={task.id} type="button" className="row" onClick={() => onOpenTask(task)}>
                <span className="dot red" />
                <span className="row-copy">
                  <span className="title">{task.title}</span>
                  <p className="sub">{task.detail}</p>
                </span>
                <span className="date-pill">{task.due}</span>
              </button>
            ))}
          </div>
          <h2 style={{ marginTop: 18 }}>Completed</h2>
          <div className="row-list">
            {COMPLETED_STEPS.map((step) => (
              <div key={step.id} className="row" style={{ cursor: "default" }}>
                <span className="dot" style={{ background: "#34c759" }} />
                <span className="row-copy">
                  <span className="title">{step.title}</span>
                  <p className="sub">{step.detail}</p>
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="section" style={{ paddingBottom: 24, paddingTop: 12 }}>
          <div className="row-list">
            {VAULT.map((doc) => (
              <div key={doc.id} className="row" style={{ cursor: "default" }}>
                <span className="icon-tile" style={{ background: "#e4e0f6" }}>
                  <IdCardIcon className="icon-svg" />
                </span>
                <span className="row-copy">
                  <span className="title">{doc.title}</span>
                  <p className="sub">{doc.meta}</p>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function ProfileScreen({
  daysHere,
  pushOn,
  setPushOn,
  onOpen,
}: {
  daysHere: number;
  pushOn: boolean;
  setPushOn: (value: boolean) => void;
  onOpen: (id: Overlay | "visa") => void;
}) {
  return (
    <>
      <section className="profile-hero">
        <div className="avatar" aria-hidden="true">
          <AvatarScene />
        </div>
        <h1>
          {USER.firstName} {USER.lastName}
        </h1>
        <p className="sub">
          {USER.city} · {USER.permit} · {USER.arrivalLabel}
        </p>
        <div className="pills">
          <span className="pill">💼 {USER.job}</span>
          <span className="pill">📍 {USER.city}</span>
        </div>
      </section>
      <div className="profile-stats">
        <div>
          <b>{daysHere}</b>
          <span>Days here</span>
        </div>
        <div>
          <b>—</b>
          <span>Events joined</span>
        </div>
        <div>
          <b>—</b>
          <span>Connections</span>
        </div>
      </div>
      <p className="group-label">ACCOUNT</p>
      <div className="row-list" style={{ margin: "0 16px" }}>
        <button type="button" className="row" onClick={() => onOpen("visa")}>
          <span className="icon-tile">
            <IdCardIcon className="icon-svg" />
          </span>
          <span className="row-copy">
            <span className="title">Permit & visa details</span>
          </span>
          <ChevronIcon className="chevron" />
        </button>
        <div className="row" style={{ cursor: "default" }}>
          <span className="icon-tile">
            <BellIcon className="icon-svg" />
          </span>
          <span className="row-copy">
            <span className="title">Enable push alerts</span>
          </span>
          <button
            type="button"
            className="toggle"
            aria-pressed={pushOn}
            aria-label="Enable push alerts"
            onClick={() => setPushOn(!pushOn)}
            style={{ background: pushOn ? "#34c759" : "#d1d1d6" }}
          />
        </div>
        <button type="button" className="row" onClick={() => onOpen("inbox")}>
          <span className="icon-tile">
            <MailboxIcon className="icon-svg" />
          </span>
          <span className="row-copy">
            <span className="title">Notification inbox</span>
          </span>
          <ChevronIcon className="chevron" />
        </button>
        <button type="button" className="row" onClick={() => onOpen("privacy")}>
          <span className="icon-tile">
            <LockIcon className="icon-svg" />
          </span>
          <span className="row-copy">
            <span className="title">Privacy & data</span>
          </span>
          <ChevronIcon className="chevron" />
        </button>
        <button type="button" className="row" onClick={() => onOpen("edit-profile")}>
          <span className="icon-tile">
            <PencilIcon className="icon-svg" />
          </span>
          <span className="row-copy">
            <span className="title">Edit profile</span>
          </span>
          <ChevronIcon className="chevron" />
        </button>
      </div>
      <p className="group-label">APPEARANCE</p>
      <div className="row-list" style={{ margin: "0 16px 24px" }}>
        <div className="row" style={{ cursor: "default" }}>
          <span className="row-copy">
            <span className="title">Light theme</span>
            <p className="sub">Matches the Dublin daytime look</p>
          </span>
        </div>
      </div>
    </>
  );
}

function OverlayScreen({
  overlay,
  task,
  search,
  onSearch,
  onBack,
  onOpenTask,
  onOpen,
}: {
  overlay: Overlay;
  task: (typeof DEADLINES)[number] | null;
  search: string;
  onSearch: (value: string) => void;
  onBack: () => void;
  onOpenTask: (task: (typeof DEADLINES)[number]) => void;
  onOpen: (overlay: Overlay) => void;
}) {
  const titleMap: Record<Overlay, string> = {
    housing: "Housing",
    events: "Events",
    referrals: "Referrals",
    messages: "Messages",
    rights: "Rights",
    help: "Help",
    members: "Members",
    knowhow: "Local Know-How",
    essentials: "Expat Essentials",
    task: task?.title || "Task",
    notifications: "Alerts",
    search: "Search",
    "edit-profile": "Edit profile",
    privacy: "Privacy & data",
    inbox: "Notification inbox",
    thread: "Expat community in Dublin",
  };

  const lists: Partial<Record<Overlay, { title: string; sub: string }[]>> = {
    housing: HOUSING.map((item) => ({ title: item.title, sub: `${item.meta} · ${item.tag}` })),
    events: EVENTS.map((item) => ({ title: item.title, sub: item.meta })),
    referrals: REFERRALS.map((item) => ({ title: item.title, sub: item.meta })),
    messages: [
      { title: "Aylin K.", sub: "Send me the role link and I will take a look." },
      { title: "EXPal", sub: "Your SIM card reminder is still open." },
    ],
    rights: RIGHTS.map((item) => ({ title: item.title, sub: item.detail })),
    members: REFERRALS.map((item) => ({ title: item.title, sub: item.meta })),
    knowhow: KNOW_HOW.map((item) => ({ title: item.title, sub: item.detail })),
    essentials: ESSENTIALS.map((item) => ({ title: item.title, sub: item.detail })),
    notifications: [
      { title: "Get a local SIM card", sub: "Due 2026-06-01" },
      { title: "Expat community in Dublin", sub: "Join threads and events nearby." },
    ],
    inbox: [
      { title: "IRP booking window", sub: "Burgh Quay slots usually open on Fridays." },
      { title: "Housing digest", sub: "3 new rooms matched your filters." },
    ],
    thread: THREADS.map((item) => ({ title: item.title, sub: item.detail })),
  };

  const hits = SEARCH_HITS.filter((hit) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${hit.title} ${hit.detail} ${hit.kind}`.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="page-head left">
        <button type="button" className="back-btn" aria-label="Back" onClick={onBack}>
          <BackIcon className="icon-svg" />
        </button>
        <h1 style={{ fontSize: 22 }}>{titleMap[overlay]}</h1>
      </div>
      {overlay === "search" ? (
        <div className="search-wrap" style={{ marginTop: 8 }}>
          <SearchIcon className="search-icon" />
          <input
            autoFocus
            value={search}
            placeholder="Search members or topics..."
            aria-label="Search members or topics"
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
      ) : null}
      {overlay === "task" && task ? (
        <div className="detail-body">
          <p>{task.detail}</p>
          <p className="muted">Due {task.due}</p>
          <button type="button" className="primary-btn">
            Mark as done
          </button>
        </div>
      ) : overlay === "help" ? (
        <div className="detail-body">
          <p>EXPal is free. Ask about PPS, IRP, banking, housing, or what a job change does to your Stamp.</p>
          <button type="button" className="chip" onClick={() => onOpenTask(DEADLINES[0])}>
            How do I get a local SIM?
          </button>
        </div>
      ) : overlay === "edit-profile" ? (
        <div className="detail-body">
          <div className="row-list">
            <div className="row" style={{ cursor: "default" }}>
              <span className="row-copy">
                <p className="sub">Name</p>
                <span className="title">
                  {USER.firstName} {USER.lastName}
                </span>
              </span>
            </div>
            <div className="row" style={{ cursor: "default" }}>
              <span className="row-copy">
                <p className="sub">Location</p>
                <span className="title">📍 {USER.city}</span>
              </span>
            </div>
            <div className="row" style={{ cursor: "default" }}>
              <span className="row-copy">
                <p className="sub">Permit</p>
                <span className="title">{USER.permit}</span>
              </span>
            </div>
            <div className="row" style={{ cursor: "default" }}>
              <span className="row-copy">
                <p className="sub">Work</p>
                <span className="title">{USER.job}</span>
              </span>
            </div>
          </div>
        </div>
      ) : overlay === "privacy" ? (
        <div className="detail-body">
          <p>Permit scans stay in your vault. Community posts are public to other members in Dublin.</p>
        </div>
      ) : overlay === "search" ? (
        <section className="section">
          <div className="row-list">
            {hits.map((hit) => (
              <button
                key={hit.id}
                type="button"
                className="row"
                onClick={() => {
                  if (hit.kind === "Member") onOpen("members");
                  else if (hit.title.includes("Rathmines")) onOpen("housing");
                  else onOpen("essentials");
                }}
              >
                <span className="row-copy">
                  <span className="title">{hit.title}</span>
                  <p className="sub">
                    {hit.kind} · {hit.detail}
                  </p>
                </span>
                <ChevronIcon className="chevron" />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="section" style={{ paddingBottom: 24 }}>
          <div className="row-list">
            {(lists[overlay] || []).map((item) => (
              <button
                key={item.title}
                type="button"
                className="row"
                onClick={() => {
                  if (overlay === "notifications" && item.title.startsWith("Get a local")) {
                    onOpenTask(DEADLINES[0]);
                  }
                }}
              >
                <span className="row-copy">
                  <span className="title">{item.title}</span>
                  <p className="sub">{item.sub}</p>
                </span>
                <ChevronIcon className="chevron" />
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function ChatSheet({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button type="button" className="sheet-backdrop" aria-label="Close chat" onClick={onClose} />
      <aside className="sheet" role="dialog" aria-label="Ask EXPal">
        <div className="sheet-handle" />
        <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>Ask EXPal</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Your friend away from home. Free, always.
        </p>
        <div className="chip-row">
          <button type="button" className="chip">
            What should I do in my first 30 days?
          </button>
          <button type="button" className="chip">
            How do I book IRP in Dublin?
          </button>
          <button type="button" className="chip">
            Who can refer me at Google Ireland?
          </button>
        </div>
      </aside>
    </>
  );
}
