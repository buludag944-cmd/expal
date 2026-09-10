"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExpalApp from "@/mobile/ExpalApp";
import {
  STORY_BEATS,
  STORY_DURATION_MS,
  storyBeatAt,
  storyPhoneKey,
  type StoryBeat,
} from "@/mobile/story-beats";
import "@/mobile/story-studio.css";

declare global {
  interface Window {
    __EXPAL_START_STORY?: () => void;
  }
}

function StoryCard({ kicker, lines }: { kicker?: string; lines: string[] }) {
  return (
    <div className="story-card" data-scene="card">
      {kicker ? <p className="story-kicker">{kicker}</p> : null}
      {lines.map((line) => (
        <p key={line} className="story-line">
          {line}
        </p>
      ))}
    </div>
  );
}

function PlayMark() {
  return (
    <div className="story-play" aria-label="Google Play">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="8" fill="#3ddc84" />
        <path d="M13 9.5v17l14-8.5-14-8.5z" fill="#111" />
      </svg>
      <span className="play-copy">
        <small>Get it on</small>
        <b>Google Play</b>
      </span>
    </div>
  );
}

function CloseScene() {
  return (
    <div className="story-close" data-scene="close">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="icon" src="/expal-logo.svg" alt="EXPal app icon" width={196} height={196} />
      <p className="wordmark">
        EX<span>Pal</span>
      </p>
      <PlayMark />
      <p className="story-name">Bahar Uludag</p>
      <p className="story-handle">Founder, EXPal</p>
    </div>
  );
}

function PhoneBeat({ beat }: { beat: StoryBeat }) {
  return (
    <div className="story-phone-stage" data-scene={storyPhoneKey(beat)}>
      <div className="phone-frame">
        <div className="phone-screen">
          <ExpalApp
            key={storyPhoneKey(beat)}
            initialTab={beat.tab}
            initialOverlay={beat.overlay ?? null}
          />
        </div>
      </div>
    </div>
  );
}

function StoryInner() {
  const params = useSearchParams();
  const previewId = params.get("preview");
  const recordMode = params.get("record") === "1";
  const [elapsed, setElapsed] = useState(() => {
    const preview = STORY_BEATS.find((beat) => beat.id === previewId);
    return preview ? preview.startMs + 80 : 0;
  });
  const [playing, setPlaying] = useState(!previewId && !recordMode);
  const beat = useMemo(() => storyBeatAt(elapsed), [elapsed]);

  useEffect(() => {
    if (previewId) {
      const preview = STORY_BEATS.find((item) => item.id === previewId);
      if (preview) setElapsed(preview.startMs + 80);
      setPlaying(false);
      return;
    }

    let started = false;
    let frame = 0;
    const startNow = () => {
      if (started) return;
      started = true;
      const origin = performance.now();
      setPlaying(true);
      const tick = (now: number) => {
        const next = Math.min(now - origin, STORY_DURATION_MS);
        setElapsed(next);
        if (next < STORY_DURATION_MS) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    window.__EXPAL_START_STORY = startNow;
    document.documentElement.dataset.storyReady = "true";
    const fallback = recordMode ? undefined : window.setTimeout(startNow, 40);

    return () => {
      if (fallback) window.clearTimeout(fallback);
      cancelAnimationFrame(frame);
      delete window.__EXPAL_START_STORY;
    };
  }, [previewId, recordMode]);

  return (
    <div className="story-root">
      <div
        className="story-stage"
        data-story-playing={playing ? "true" : "false"}
        data-beat={beat.id}
        data-kind={beat.kind}
      >
        {beat.kind === "card" ? <StoryCard kicker={beat.kicker} lines={beat.lines || []} /> : null}
        {beat.kind === "phone" ? <PhoneBeat beat={beat} /> : null}
        {beat.kind === "close" ? <CloseScene /> : null}
        {beat.kind === "phone" && !recordMode ? (
          <p className="story-caption">
            {beat.caption}
            {beat.captionLine2 ? <small>{beat.captionLine2}</small> : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function LinkedInStoryPage() {
  return (
    <Suspense fallback={null}>
      <StoryInner />
    </Suspense>
  );
}
