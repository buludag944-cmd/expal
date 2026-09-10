"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  LINKEDIN_AD_BEATS,
  LINKEDIN_AD_DURATION_MS,
  linkedInAdBeatAt,
  type LinkedInAdBeat,
} from "@/mobile/linkedin-ad-beats";
import "@/mobile/linkedin-ad-studio.css";

declare global {
  interface Window {
    __EXPAL_START_LM?: () => void;
  }
}

function StoreMark({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div className="lm-play" aria-label={label}>
      {children}
      <span className="play-copy">
        <small>{sub}</small>
        <b>{label}</b>
      </span>
    </div>
  );
}

function AppStoreMark() {
  return (
    <StoreMark label="App Store" sub="Download on the">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="8" fill="#111" />
        <path
          fill="#fff"
          d="M18.2 9.2c.8-1 2.1-1.7 3.3-1.8-.1 1.5-.9 2.8-2.1 3.6-.8.5-1.8.9-2.7.8.2-1.3.7-2.6 1.5-2.6zm-1.4 3.2c1.4-1.7 4-2 5.8-.8 1 .7 1.7 1.8 1.8 3.1 0 2.9-2.3 6.3-4.1 8-.9.8-1.9.5-2.8-.1-.8-.5-1.6-.5-2.4 0-.8.5-1.7.9-2.6.1C9.7 21.4 8.4 17.8 8.4 15.2c0-2.9 2.1-4.8 4.6-5 1 0 1.9.4 2.5 1.2z"
        />
      </svg>
    </StoreMark>
  );
}

function PlayMark() {
  return (
    <StoreMark label="Google Play" sub="Get it on">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="8" fill="#3ddc84" />
        <path d="M13 9.5v17l14-8.5-14-8.5z" fill="#111" />
      </svg>
    </StoreMark>
  );
}

function HookScene({ caption, captionLine2 }: { caption: string; captionLine2?: string }) {
  return (
    <div className="lm-hook" data-scene="hook">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand" src="/expal-brand.png" alt="EXPal" width={900} height={900} />
      <p className="lm-line">
        {caption}
        {captionLine2 ? <small>{captionLine2}</small> : null}
      </p>
    </div>
  );
}

function CtaScene({ caption, captionLine2 }: { caption: string; captionLine2?: string }) {
  return (
    <div className="lm-cta" data-scene="cta">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand" src="/expal-brand.png" alt="EXPal" width={720} height={720} />
      <div className="lm-cta-copy">
        <div className="lm-stores">
          <AppStoreMark />
          <PlayMark />
        </div>
        <p className="lm-line">
          {caption}
          {captionLine2 ? <small>{captionLine2}</small> : null}
        </p>
      </div>
    </div>
  );
}

function PhoneBeat({ beat }: { beat: LinkedInAdBeat }) {
  return (
    <div className="lm-phone" data-scene={beat.id}>
      <div className="phone-frame is-shot">
        <div className="phone-screen">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="phone-shot" src={beat.shot} alt="" />
        </div>
      </div>
    </div>
  );
}

function LinkedInAdInner() {
  const params = useSearchParams();
  const previewId = params.get("preview");
  const recordMode = params.get("record") === "1";
  const wide = params.get("wide") === "1";
  const [elapsed, setElapsed] = useState(() => {
    const preview = LINKEDIN_AD_BEATS.find((beat) => beat.id === previewId);
    return preview ? preview.startMs + 80 : 0;
  });
  const [playing, setPlaying] = useState(!previewId && !recordMode);
  const beat = useMemo(() => linkedInAdBeatAt(elapsed), [elapsed]);

  useEffect(() => {
    if (previewId) {
      const preview = LINKEDIN_AD_BEATS.find((item) => item.id === previewId);
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
        const next = Math.min(now - origin, LINKEDIN_AD_DURATION_MS);
        setElapsed(next);
        if (next < LINKEDIN_AD_DURATION_MS) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    window.__EXPAL_START_LM = startNow;
    document.documentElement.dataset.lmReady = "true";
    const fallback = recordMode ? undefined : window.setTimeout(startNow, 40);

    return () => {
      if (fallback) window.clearTimeout(fallback);
      cancelAnimationFrame(frame);
      delete window.__EXPAL_START_LM;
    };
  }, [previewId, recordMode]);

  const shots = [
    "/expal-brand.png",
    ...LINKEDIN_AD_BEATS.filter((item) => item.shot).map((item) => item.shot as string),
  ];

  return (
    <div className="lm-root">
      <div className="lm-preload" aria-hidden="true">
        {shots.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" />
        ))}
      </div>
      <div
        className={`lm-stage${wide ? " is-wide" : ""}`}
        data-lm-playing={playing ? "true" : "false"}
        data-beat={beat.id}
        data-kind={beat.kind}
        data-wide={wide ? "true" : "false"}
      >
        {beat.kind === "hook" ? (
          <HookScene caption={beat.caption} captionLine2={beat.captionLine2} />
        ) : null}
        {beat.kind === "phone" ? <PhoneBeat beat={beat} /> : null}
        {beat.kind === "cta" ? (
          <CtaScene caption={beat.caption} captionLine2={beat.captionLine2} />
        ) : null}
        {beat.kind === "phone" && (!recordMode || wide) ? (
          <p className="lm-caption">
            {beat.caption}
            {beat.captionLine2 ? <small>{beat.captionLine2}</small> : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function LinkedInMarketingPage() {
  return (
    <Suspense fallback={null}>
      <LinkedInAdInner />
    </Suspense>
  );
}
