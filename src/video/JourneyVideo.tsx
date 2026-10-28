import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { JOURNEY_BEATS, type JourneyBeat } from "./journey-beats";

const ink = "#1a1210";
const coral = "#f25c54";
const sky = "#3abde0";
const paper = "#fff6f1";
const mute = "#6d625c";
const font = "Arial, Helvetica, ui-sans-serif, system-ui, sans-serif";

function rise(delay = 0): CSSProperties {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [delay, delay + 12], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `translateY(${y}px)` };
}

function SeriesMark({ light = false }: { light?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: font,
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: "0.04em",
        color: light ? "rgba(255,255,255,0.92)" : coral,
      }}
    >
      <span>Vibe-coder's Journey</span>
      <span>01</span>
    </div>
  );
}

function Caption({ beat, onDark = false }: { beat: JourneyBeat; onDark?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        right: 56,
        bottom: 52,
        zIndex: 8,
        padding: "26px 32px 28px",
        borderRadius: 28,
        background: onDark ? "#2a2220" : ink,
        border: onDark ? "2px solid rgba(255,255,255,0.35)" : "2px solid transparent",
        boxShadow: "0 16px 40px rgba(26,18,16,0.18)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: font,
          fontWeight: 800,
          fontSize: 36,
          lineHeight: 1.18,
          letterSpacing: "-0.03em",
          color: "#fff",
          textAlign: "left",
        }}
      >
        {beat.caption}
        <span style={{ display: "block", marginTop: 8, fontWeight: 700, color: "rgba(255,255,255,0.92)" }}>
          {beat.captionLine2}
        </span>
      </p>
    </div>
  );
}

function Kicker({ children }: { children: string }) {
  return (
    <p
      style={{
        margin: "28px 0 12px",
        fontFamily: font,
        fontSize: 24,
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: coral,
      }}
    >
      {children}
    </p>
  );
}

function Shell({
  beat,
  children,
  background = paper,
  onDark = false,
}: {
  beat: JourneyBeat;
  children: ReactNode;
  background?: string;
  onDark?: boolean;
}) {
  return (
    <AbsoluteFill style={{ background, fontFamily: font, color: ink }}>
      <div style={{ padding: "56px 64px 0" }}>
        <SeriesMark light={background === coral} />
        {children}
      </div>
      <Caption beat={beat} onDark={onDark} />
    </AbsoluteFill>
  );
}

function MapRow({
  n,
  title,
  detail,
  delay,
}: {
  n: string;
  title: string;
  detail: string;
  delay: number;
}) {
  return (
    <div
      style={{
        ...rise(delay),
        display: "flex",
        gap: 18,
        alignItems: "center",
        background: "#fff",
        borderRadius: 20,
        padding: "16px 20px",
        marginTop: 12,
      }}
    >
      <span
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: coral,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {n}
      </span>
      <span>
        <b style={{ display: "block", fontSize: 30, letterSpacing: "-0.03em" }}>{title}</b>
        <span style={{ display: "block", marginTop: 2, fontSize: 22, color: mute }}>{detail}</span>
      </span>
    </div>
  );
}

function WelcomeScene({ beat }: { beat: JourneyBeat }) {
  const parts = ["01  How I mapped the features", "02  Phone layout vs desktop", "03  Backend bugs, and the fix"];
  return (
    <AbsoluteFill style={{ background: coral, fontFamily: font, color: "#fff" }}>
      <div style={{ padding: "56px 64px 0" }}>
        <SeriesMark light />
        <p style={{ ...rise(4), margin: "56px 0 0", fontSize: 26, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Episode 01
        </p>
        <h1 style={{ ...rise(8), margin: "14px 0 0", fontSize: 84, lineHeight: 0.96, letterSpacing: "-0.045em", fontWeight: 800 }}>
          Welcome.
        </h1>
        <p style={{ ...rise(16), margin: "24px 0 0", maxWidth: 880, fontSize: 36, lineHeight: 1.25, fontWeight: 700 }}>
          How I built EXPal. The map, the phone, and the server.
        </p>
        <div style={{ marginTop: 40 }}>
          {parts.map((part, index) => (
            <p
              key={part}
              style={{
                ...rise(22 + index * 6),
                margin: index === 0 ? 0 : "16px 0 0",
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              {part}
            </p>
          ))}
        </div>
      </div>
      <Caption beat={beat} />
    </AbsoluteFill>
  );
}

function MapScene({ beat }: { beat: JourneyBeat }) {
  const chips = ["Housing", "Visa / IRP", "PPS", "Community", "Referrals", "Job tracker"];
  return (
    <Shell beat={beat}>
      <Kicker>{beat.kicker}</Kicker>
      <h1 style={{ ...rise(2), margin: 0, fontSize: 52, lineHeight: 1.02, letterSpacing: "-0.04em" }}>
        The move, written down first.
      </h1>
      <MapRow n="01" title="Public page" detail="People land with no login" delay={8} />
      <MapRow n="02" title="A journal I can post" detail="Guides, before an account" delay={14} />
      <MapRow n="03" title="Same Google sign-in" detail="The account comes after the door" delay={20} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
        {chips.map((label, index) => (
          <span
            key={label}
            style={{
              ...rise(28 + index * 3),
              padding: "10px 16px",
              borderRadius: 999,
              background: "#fff",
              border: `2px solid ${ink}`,
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            {label}
          </span>
        ))}
      </div>
      <p style={{ ...rise(48), margin: "16px 0 0", fontSize: 22, color: mute, fontWeight: 700 }}>
        Home · Explore · Community · Journey · Profile
      </p>
    </Shell>
  );
}

function LayoutScene({ beat }: { beat: JourneyBeat }) {
  return (
    <Shell beat={beat}>
      <Kicker>{beat.kicker}</Kicker>
      <h1 style={{ ...rise(2), margin: 0, fontSize: 48, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
        Fine on a desk. Broken on a phone.
      </h1>
      <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
        <div style={{ ...rise(8), flex: 1.15, background: "#fff", borderRadius: 24, padding: 18 }}>
          <b style={{ fontSize: 18, letterSpacing: "0.1em", color: "#1d8a3a" }}>DESKTOP</b>
          <div style={{ marginTop: 14, height: 250, borderRadius: 16, background: paper, border: "2px solid #efe4de", position: "relative" }}>
            <div style={{ height: 28, background: "#fff", borderBottom: "1px solid #efe4de" }} />
            <div style={{ position: "absolute", left: 24, top: 70, width: 180, padding: 12, borderRadius: 12, background: "#fff", border: `2px solid ${ink}`, fontSize: 16, fontWeight: 800 }}>
              Add a job
              <span style={{ display: "block", marginTop: 8, color: mute, fontWeight: 700 }}>On the screen</span>
            </div>
          </div>
        </div>
        <div style={{ ...rise(14), flex: 0.85, background: "#fff", borderRadius: 24, padding: 18 }}>
          <b style={{ fontSize: 18, letterSpacing: "0.1em", color: coral }}>PHONE</b>
          <div style={{ marginTop: 14, height: 250, borderRadius: 28, background: "#111", padding: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 22, background: paper, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 10, right: -30, top: 36, padding: 10, borderRadius: 12, background: "#fff", border: `2px solid ${coral}`, fontSize: 15, fontWeight: 800, color: coral }}>
                Popup off the edge
              </div>
              <div style={{ position: "absolute", right: 10, bottom: 52, width: 36, height: 36, borderRadius: 18, background: coral }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 42, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>
                Tabs cover Send
              </div>
            </div>
          </div>
        </div>
      </div>
      <p style={{ ...rise(24), margin: "18px 0 0", fontSize: 26, fontWeight: 800, lineHeight: 1.3 }}>
        The fix: pin dialogs, sheets, and the chat button to the screen you can see.
      </p>
    </Shell>
  );
}

function BackendScene({ beat }: { beat: JourneyBeat }) {
  const rows = [
    {
      problem: "Accounts vanished on redeploy",
      fix: "Put them in a real database",
    },
    {
      problem: "Google sign-in forgot the profile",
      fix: "Read the saved profile after login",
    },
  ];
  return (
    <Shell beat={beat}>
      <Kicker>{beat.kicker}</Kicker>
      <h1 style={{ ...rise(2), margin: 0, fontSize: 48, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
        The server forgot people.
      </h1>
      {rows.map((row, index) => (
        <div key={row.problem} style={{ ...rise(10 + index * 8), marginTop: 18, background: "#fff", borderRadius: 22, padding: "18px 20px" }}>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.1em", color: coral }}>PROBLEM</span>
          <b style={{ display: "block", marginTop: 6, fontSize: 28, letterSpacing: "-0.03em" }}>{row.problem}</b>
          <span style={{ display: "block", marginTop: 12, fontSize: 16, fontWeight: 800, letterSpacing: "0.1em", color: "#1d8a3a" }}>FIX</span>
          <span style={{ display: "block", marginTop: 4, fontSize: 26, fontWeight: 800 }}>{row.fix}</span>
        </div>
      ))}
    </Shell>
  );
}

function CloseScene({ beat }: { beat: JourneyBeat }) {
  const rules = [
    "Mapped the move before the screens.",
    "Pinned the phone to the visible screen.",
    "Accounts and profiles survive a restart.",
  ];
  return (
    <AbsoluteFill style={{ background: ink, fontFamily: font, color: "#fff" }}>
      <div style={{ padding: "56px 64px 0" }}>
        <SeriesMark light />
        <Kicker>{beat.kicker}</Kicker>
        {rules.map((rule, index) => (
          <p
            key={rule}
            style={{
              ...rise(6 + index * 8),
              margin: index === 0 ? "8px 0 0" : "16px 0 0",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: coral, marginRight: 14 }}>0{index + 1}</span>
            {rule}
          </p>
        ))}
        <p style={{ ...rise(36), margin: "40px 0 0", fontSize: 32, fontWeight: 800, color: sky, letterSpacing: "-0.03em" }}>
          Relocate smarter.
          <span style={{ display: "block" }}>Settle faster. Thrive longer.</span>
        </p>
      </div>
      <Caption beat={beat} onDark />
    </AbsoluteFill>
  );
}

function BeatScene({ beat }: { beat: JourneyBeat }) {
  if (beat.id === "welcome") return <WelcomeScene beat={beat} />;
  if (beat.id === "map") return <MapScene beat={beat} />;
  if (beat.id === "layout") return <LayoutScene beat={beat} />;
  if (beat.id === "backend") return <BackendScene beat={beat} />;
  return <CloseScene beat={beat} />;
}

export const JourneyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: paper }}>
      {JOURNEY_BEATS.map((beat) => (
        <Sequence key={beat.id} from={beat.from} durationInFrames={beat.durationInFrames}>
          <BeatScene beat={beat} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
