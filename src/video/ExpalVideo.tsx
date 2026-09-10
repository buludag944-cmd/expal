import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SHORT_BEATS, type ShortBeat } from "./short-beats";

const coral = "#f25c54";
const font =
  "Arial, Helvetica, ui-sans-serif, system-ui, sans-serif";

function useFadeIn(): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function Caption({
  line,
  line2,
  variant,
}: {
  line: string;
  line2?: string;
  variant: "hook" | "phone" | "cta";
}) {
  const base: CSSProperties = {
    margin: 0,
    fontFamily: font,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#fff",
    textAlign: "center",
  };

  if (variant === "phone") {
    return (
      <p
        style={{
          ...base,
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 168,
          zIndex: 8,
          fontSize: 48,
          lineHeight: 1.18,
          WebkitTextStroke: "7px #000",
          paintOrder: "stroke fill",
          textShadow: "0 3px 0 #000, 0 10px 24px rgba(0,0,0,0.45)",
        }}
      >
        {line}
        {line2 ? (
          <span style={{ display: "block", marginTop: 10, fontSize: 48, fontWeight: 800 }}>
            {line2}
          </span>
        ) : null}
      </p>
    );
  }

  return (
    <p
      style={{
        ...base,
        fontSize: variant === "cta" ? 44 : 46,
        lineHeight: 1.22,
        maxWidth: 920,
        padding: variant === "hook" ? "0 48px 32px" : 0,
      }}
    >
      {line}
      {line2 ? (
        <span
          style={{
            display: "block",
            marginTop: 8,
            fontSize: variant === "cta" ? 44 : 46,
            fontWeight: 800,
          }}
        >
          {line2}
        </span>
      ) : null}
    </p>
  );
}

function StoreBadge({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px 10px 10px",
        borderRadius: 10,
        background: "#111",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "#fff",
      }}
    >
      {children}
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
        <small
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {sub}
        </small>
        <b style={{ fontSize: 18, fontWeight: 800 }}>{label}</b>
      </span>
    </div>
  );
}

function Stores() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <StoreBadge label="App Store" sub="Download on the">
        <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
          <rect width="36" height="36" rx="8" fill="#111" />
          <path
            fill="#fff"
            d="M18.2 9.2c.8-1 2.1-1.7 3.3-1.8-.1 1.5-.9 2.8-2.1 3.6-.8.5-1.8.9-2.7.8.2-1.3.7-2.6 1.5-2.6zm-1.4 3.2c1.4-1.7 4-2 5.8-.8 1 .7 1.7 1.8 1.8 3.1 0 2.9-2.3 6.3-4.1 8-.9.8-1.9.5-2.8-.1-.8-.5-1.6-.5-2.4 0-.8.5-1.7.9-2.6.1C9.7 21.4 8.4 17.8 8.4 15.2c0-2.9 2.1-4.8 4.6-5 1 0 1.9.4 2.5 1.2z"
          />
        </svg>
      </StoreBadge>
      <StoreBadge label="Google Play" sub="Get it on">
        <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
          <rect width="36" height="36" rx="8" fill="#3ddc84" />
          <path d="M13 9.5v17l14-8.5-14-8.5z" fill="#111" />
        </svg>
      </StoreBadge>
    </div>
  );
}

function HookScene({ beat }: { beat: ShortBeat }) {
  const opacity = useFadeIn();
  return (
    <AbsoluteFill
      style={{
        background: coral,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
      }}
    >
      <Img
        src={staticFile("expal-brand.png")}
        style={{
          display: "block",
          width: 900,
          height: 900,
          marginTop: 72,
          objectFit: "cover",
          borderRadius: 28,
        }}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Caption line={beat.caption} line2={beat.captionLine2} variant="hook" />
      </div>
    </AbsoluteFill>
  );
}

function PhoneScene({ beat }: { beat: ShortBeat }) {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 12], [1.58, 1.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(900px 640px at 50% 8%, rgba(226, 71, 60, 0.34), transparent 58%), radial-gradient(820px 720px at 50% 92%, rgba(59, 79, 163, 0.38), transparent 55%), linear-gradient(165deg, #1a1016 0%, #241226 42%, #121526 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 96,
          display: "flex",
          justifyContent: "center",
          opacity,
        }}
      >
        <div
          style={{
            width: 390,
            height: 844,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            background: "#0c0c0e",
            borderRadius: 54,
            padding: 12,
            boxShadow: "0 0 0 2px #2a2a2e, 0 40px 80px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              width: 366,
              height: 820,
              borderRadius: 42,
              overflow: "hidden",
              background: "#f3f3f5",
            }}
          >
            <Img
              src={staticFile(beat.shot ?? "story/home.jpg")}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          </div>
        </div>
      </div>
      <Caption line={beat.caption} line2={beat.captionLine2} variant="phone" />
    </AbsoluteFill>
  );
}

function CtaScene({ beat }: { beat: ShortBeat }) {
  const opacity = useFadeIn();
  return (
    <AbsoluteFill
      style={{
        background: coral,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 48px 72px",
        opacity,
      }}
    >
      <Img
        src={staticFile("expal-brand.png")}
        style={{
          display: "block",
          width: 640,
          height: 640,
          objectFit: "cover",
          borderRadius: 36,
          boxShadow: "0 28px 60px rgba(0,0,0,0.22)",
        }}
      />
      <div style={{ marginTop: 28 }}>
        <Stores />
      </div>
      <div style={{ marginTop: 28 }}>
        <Caption line={beat.caption} line2={beat.captionLine2} variant="cta" />
      </div>
    </AbsoluteFill>
  );
}

function BeatScene({ beat }: { beat: ShortBeat }) {
  if (beat.kind === "hook") return <HookScene beat={beat} />;
  if (beat.kind === "phone") return <PhoneScene beat={beat} />;
  return <CtaScene beat={beat} />;
}

export const ExpalVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#09070a" }}>
      {SHORT_BEATS.map((beat) => (
        <Sequence
          key={beat.id}
          from={beat.from}
          durationInFrames={beat.durationInFrames}
          name={beat.id}
        >
          <BeatScene beat={beat} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
