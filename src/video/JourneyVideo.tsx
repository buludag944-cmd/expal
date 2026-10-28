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
          fontSize: 38,
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

function GateCard({
  tone,
  label,
  title,
  lines,
  delay,
}: {
  tone: "before" | "after";
  label: string;
  title: string;
  lines: string[];
  delay: number;
}) {
  const bad = tone === "before";
  return (
    <div
      style={{
        ...rise(delay),
        flex: 1,
        borderRadius: 28,
        padding: "22px 22px 26px",
        background: bad ? "#f3eeea" : "#fff",
        border: bad ? "2px solid #e4d8d2" : `3px solid ${ink}`,
        boxShadow: bad ? "none" : "0 12px 28px rgba(26,18,16,0.08)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "6px 12px",
          borderRadius: 999,
          background: bad ? "#c9b8b2" : sky,
          color: bad ? "#fff" : ink,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
      <b
        style={{
          display: "block",
          marginTop: 18,
          fontSize: 32,
          letterSpacing: "-0.03em",
          color: bad ? mute : ink,
        }}
      >
        {title}
      </b>
      {lines.map((line) => (
        <span
          key={line}
          style={{
            display: "block",
            marginTop: 8,
            fontSize: 24,
            lineHeight: 1.3,
            color: bad ? "#8a7d76" : ink,
            fontWeight: bad ? 600 : 700,
          }}
        >
          {line}
        </span>
      ))}
    </div>
  );
}

function MiniPhone({
  clipped,
  delay,
}: {
  clipped: boolean;
  delay: number;
}) {
  return (
    <div style={{ ...rise(delay), width: 360 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "0.12em",
          color: clipped ? coral : "#1d8a3a",
          marginBottom: 12,
        }}
      >
        {clipped ? "PROBLEM" : "FIXED"}
      </div>
      <div
        style={{
          height: 520,
          borderRadius: 36,
          background: "#111",
          padding: clipped ? 0 : 10,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 16px 30px rgba(26,18,16,0.16)",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: clipped ? 0 : 28,
            background: paper,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: clipped ? 460 : "100%",
              marginLeft: clipped ? -70 : 0,
              padding: "22px 18px 0",
            }}
          >
            <div style={{ height: 10, width: 90, borderRadius: 99, background: "#111", margin: "0 auto 18px" }} />
            <b style={{ fontSize: 28, letterSpacing: "-0.03em" }}>Home</b>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              {["Housing", "Visa", "Community", "Referrals", "Rights", "Events"].map((item) => (
                <span
                  key={item}
                  style={{
                    width: clipped ? 120 : "47%",
                    padding: "14px 10px",
                    borderRadius: 14,
                    background: "#fff",
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          {clipped ? (
            <span
              style={{
                position: "absolute",
                left: 8,
                top: 250,
                fontSize: 22,
                fontWeight: 800,
                color: coral,
              }}
            >
              …without
            </span>
          ) : (
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 72,
                background: ink,
                color: "#fff",
                borderRadius: 14,
                padding: "10px 12px",
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              Captions on
            </div>
          )}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: clipped ? -40 : 0,
              bottom: 0,
              height: 54,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              fontSize: 13,
              fontWeight: 800,
              color: mute,
              borderTop: "1px solid #efe4de",
            }}
          >
            <span style={{ color: coral }}>Home</span>
            <span>Explore</span>
            <span>Community</span>
            <span>Journey</span>
            <span>Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeScene({ beat }: { beat: JourneyBeat }) {
  const problems = ["01  Login wall", "02  Gmail on the profile", "03  The phone frame"];
  return (
    <AbsoluteFill style={{ background: coral, fontFamily: font, color: "#fff" }}>
      <div style={{ padding: "56px 64px 0" }}>
        <SeriesMark light />
        <p style={{ ...rise(4), margin: "64px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Episode 01
        </p>
        <h1 style={{ ...rise(8), margin: "16px 0 0", fontSize: 92, lineHeight: 0.96, letterSpacing: "-0.045em", fontWeight: 800 }}>
          Welcome.
        </h1>
        <p style={{ ...rise(16), margin: "28px 0 0", maxWidth: 860, fontSize: 40, lineHeight: 1.25, fontWeight: 700 }}>
          A series on how I built my app, and the problems I faced.
        </p>
        <div style={{ marginTop: 36 }}>
          {problems.map((problem, index) => (
            <p
              key={problem}
              style={{
                ...rise(24 + index * 6),
                margin: index === 0 ? 0 : "14px 0 0",
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              {problem}
            </p>
          ))}
        </div>
      </div>
      <Caption beat={beat} />
    </AbsoluteFill>
  );
}

function LoginScene({ beat }: { beat: JourneyBeat }) {
  return (
    <Shell beat={beat}>
      <Kicker>{beat.kicker}</Kicker>
      <h1 style={{ ...rise(2), margin: 0, fontSize: 54, lineHeight: 1.05, letterSpacing: "-0.045em" }}>
        Everyone landed on login.
      </h1>
      <div style={{ display: "flex", gap: 18, marginTop: 28 }}>
        <GateCard
          tone="before"
          label="PROBLEM"
          title="Sign in to continue"
          lines={["The old site opened on login.", "Nothing to land on."]}
          delay={10}
        />
        <GateCard
          tone="after"
          label="FIX"
          title="Journal stays open"
          lines={["You can read it straight away.", "Account only when you want one."]}
          delay={18}
        />
      </div>
      <p style={{ ...rise(30), margin: "26px 0 0", fontSize: 28, fontWeight: 700, lineHeight: 1.35 }}>
        I fixed that. If you can't land, you can't be found.
      </p>
    </Shell>
  );
}

function ProfileScene({ beat }: { beat: JourneyBeat }) {
  return (
    <Shell beat={beat}>
      <Kicker>{beat.kicker}</Kicker>
      <h1 style={{ ...rise(2), margin: 0, fontSize: 52, lineHeight: 1.05, letterSpacing: "-0.045em" }}>
        Gmail was sitting on the profile.
      </h1>
      <div
        style={{
          ...rise(12),
          marginTop: 28,
          background: "#fff",
          borderRadius: 32,
          padding: "28px 28px 24px",
          boxShadow: "0 14px 32px rgba(26,18,16,0.06)",
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 28,
              background: coral,
              color: "#fff",
              fontSize: 40,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            B
          </div>
          <div>
            <b style={{ fontSize: 36, letterSpacing: "-0.03em" }}>Bahar</b>
            <span style={{ display: "block", marginTop: 4, fontSize: 26, fontWeight: 800 }}>
              Dublin · Work permit
            </span>
          </div>
        </div>
        <div
          style={{
            marginTop: 22,
            padding: "16px 18px",
            borderRadius: 18,
            background: "#fff1ef",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <span style={{ color: coral, fontSize: 28, fontWeight: 800, textDecoration: "line-through" }}>
            name@gmail.com
          </span>
          <span style={{ color: coral, fontSize: 18, fontWeight: 800, letterSpacing: "0.08em" }}>REMOVED</span>
        </div>
        <p style={{ margin: "14px 0 0", fontSize: 24, color: mute, fontWeight: 700 }}>
          The fix: I took the email off. Dublin and a work permit stayed.
        </p>
      </div>
      <p style={{ ...rise(28), margin: "22px 0 0", fontSize: 28, fontWeight: 800, lineHeight: 1.35 }}>
        I also cut the line the real screen never had.
      </p>
    </Shell>
  );
}

function LayoutScene({ beat }: { beat: JourneyBeat }) {
  return (
    <Shell beat={beat}>
      <Kicker>{beat.kicker}</Kicker>
      <h1 style={{ ...rise(2), margin: "0 0 8px", fontSize: 48, lineHeight: 1.05, letterSpacing: "-0.045em" }}>
        The menu fell off the phone.
      </h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <MiniPhone clipped delay={8} />
        <MiniPhone clipped={false} delay={16} />
      </div>
    </Shell>
  );
}

function CloseScene({ beat }: { beat: JourneyBeat }) {
  const rules = [
    "Journal stays open.",
    "Gmail off. Dublin stayed.",
    "Built the frame. Wrote the captions.",
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
              margin: index === 0 ? "12px 0 0" : "18px 0 0",
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: coral, marginRight: 16 }}>0{index + 1}</span>
            {rule}
          </p>
        ))}
        <p style={{ ...rise(36), margin: "48px 0 0", fontSize: 34, fontWeight: 800, color: sky, letterSpacing: "-0.03em" }}>
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
  if (beat.id === "login") return <LoginScene beat={beat} />;
  if (beat.id === "profile") return <ProfileScene beat={beat} />;
  if (beat.id === "layout") return <LayoutScene beat={beat} />;
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
