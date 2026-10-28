import type { CSSProperties } from "react";
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  JOURNEY_BEATS,
  JOURNEY_VISUALS,
  journeyBeatAtFrame,
  type JourneyBeat,
  type JourneyVisual,
} from "./journey-beats";

const ink = "#1a1210";
const paper = "#f6f1eb";
const font = "Arial, Helvetica, ui-sans-serif, system-ui, sans-serif";

const TOP = 78;
const BOTTOM = 1136;

function zoomFor(frame: number, visualFrom: number): number {
  const local = Math.max(0, frame - visualFrom);
  return interpolate(local, [0, 150], [1, 1.035], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function ShotFrame({ visual, zoom }: { visual: JourneyVisual; zoom: number }) {
  if (visual.kind === "phone") {
    const height = 980;
    const width = Math.round(height * 0.462);
    return (
      <div
        style={{
          position: "absolute",
          top: 96,
          left: "50%",
          width,
          height,
          transform: "translateX(-50%)",
          borderRadius: 36,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 22px 60px rgba(26,18,16,0.18)",
        }}
      >
        <Img
          src={staticFile(visual.src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: visual.position ?? "top",
            transform: `scale(${zoom})`,
          }}
        />
      </div>
    );
  }

  if (visual.kind === "pair" && visual.src2) {
    return (
      <>
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 108,
            width: 700,
            height: 420,
            borderRadius: 18,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 16px 44px rgba(26,18,16,0.14)",
          }}
        >
          <Img
            src={staticFile(visual.src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "left center",
              transform: `scale(${zoom})`,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 248,
            width: 390,
            height: 844,
            borderRadius: 32,
            overflow: "hidden",
            background: "#fff",
            border: "4px solid #fff",
            boxShadow: "0 22px 50px rgba(26,18,16,0.22)",
          }}
        >
          <Img
            src={staticFile(visual.src2)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </div>
      </>
    );
  }

  const aspect = visual.aspect ?? 1.6;
  const maxW = 1008;
  const maxH = BOTTOM - TOP - 24;
  let width = maxW;
  let height = width / aspect;
  if (height > maxH) {
    height = maxH;
    width = height * aspect;
  }
  const box: CSSProperties = {
    left: (1080 - width) / 2,
    top: TOP + (maxH - height) / 2,
    width,
    height,
  };

  return (
    <div
      style={{
        position: "absolute",
        ...box,
        borderRadius: 20,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 18px 50px rgba(26,18,16,0.12)",
      }}
    >
      <Img
        src={staticFile(visual.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          transform: `scale(${zoom})`,
          background: "#fff",
        }}
      />
    </div>
  );
}

function Picture({ beat }: { beat: JourneyBeat }) {
  const frame = useCurrentFrame();
  const local = frame - beat.from;
  const previous = beat.from > 0 ? journeyBeatAtFrame(beat.from - 1) : null;
  const cross = previous && previous.visual !== beat.visual && local < 8;
  const opacity = cross ? interpolate(local, [0, 8], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const current = JOURNEY_VISUALS[beat.visual];

  return (
    <>
      {cross && previous ? (
        <ShotFrame visual={JOURNEY_VISUALS[previous.visual]} zoom={zoomFor(frame, previous.visualFrom)} />
      ) : null}
      <div style={{ opacity }}>
        <ShotFrame visual={current} zoom={zoomFor(frame, beat.visualFrom)} />
      </div>
    </>
  );
}

function Caption({ beat }: { beat: JourneyBeat }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - beat.from, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 36,
        right: 36,
        bottom: 32,
        zIndex: 8,
        opacity,
      }}
    >
      <div
        style={{
          background: ink,
          borderRadius: 22,
          padding: "22px 26px 24px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: font,
            fontWeight: 700,
            fontSize: 32,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "#fff",
          }}
        >
          {beat.caption}
          {beat.captionLine2 ? (
            <span style={{ display: "block", marginTop: 8, fontWeight: 650, color: "rgba(255,255,255,0.94)" }}>
              {beat.captionLine2}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

export const JourneyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = journeyBeatAtFrame(frame);

  return (
    <AbsoluteFill style={{ background: paper, fontFamily: font, color: ink }}>
      <Audio src={staticFile("journey/voice.m4a")} />
      <Picture beat={beat} />
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 36,
          zIndex: 9,
          background: "rgba(246,241,235,0.94)",
          borderRadius: 999,
          padding: "8px 14px",
          fontFamily: font,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: ink,
        }}
      >
        Vibe-coder's Journey · 01
      </div>
      <Caption beat={beat} />
    </AbsoluteFill>
  );
};

export const JOURNEY_BEAT_COUNT = JOURNEY_BEATS.length;
