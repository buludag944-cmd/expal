"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExpalApp from "@/mobile/ExpalApp";
import { AD_BEATS, AD_DURATION_MS, beatAt, phoneScreenKey, type AdBeat } from "@/mobile/ad-beats";
import "@/mobile/ad-studio.css";

declare global {
  interface Window {
    __EXPAL_START_AD?: () => void;
  }
}

function HookScene() {
  return (
    <div className="hook" data-scene="hook">
      <div className="hook-tabs" aria-hidden="true">
        <article className="fake-tab t1">
          <header>
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            dublin housing facebook
          </header>
          <p>14,002 members · no Irish guarantor</p>
        </article>
        <article className="fake-tab t2">
          <header>
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            pps number appointment wait
          </header>
          <p>MyCitizenPortal · “16 weeks and counting”</p>
        </article>
        <article className="fake-tab t3">
          <header>
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            reddit stamp 1 bank account
          </header>
          <p>r/MoveToIreland · 40 comments, five answers</p>
        </article>
        <article className="fake-tab t4">
          <header>
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            how to get a leap card ireland
          </header>
          <p>Three blogs, two PDFs, still no card</p>
        </article>
      </div>
    </div>
  );
}

function CtaScene({ caption }: { caption: string }) {
  return (
    <div className="cta" data-scene="cta">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/expal-logo.svg" alt="EXPal app icon" width={280} height={280} />
      <p className="wordmark">
        EX<span>Pal</span>
      </p>
      <p className="ad-caption is-cta">{caption}</p>
    </div>
  );
}

function MarketingAdInner() {
  const params = useSearchParams();
  const previewId = params.get("preview");
  const recordMode = params.get("record") === "1";
  const [elapsed, setElapsed] = useState(() => {
    const preview = AD_BEATS.find((beat) => beat.id === previewId);
    return preview ? preview.startMs + 80 : 0;
  });
  const [playing, setPlaying] = useState(!previewId && !recordMode);

  const beat = useMemo(() => beatAt(elapsed), [elapsed]);

  useEffect(() => {
    if (previewId) {
      const preview = AD_BEATS.find((item) => item.id === previewId);
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
        const next = Math.min(now - origin, AD_DURATION_MS);
        setElapsed(next);
        if (next < AD_DURATION_MS) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    window.__EXPAL_START_AD = startNow;
    document.documentElement.dataset.adReady = "true";
    const fallback = recordMode ? undefined : window.setTimeout(startNow, 40);

    return () => {
      if (fallback) window.clearTimeout(fallback);
      cancelAnimationFrame(frame);
      delete window.__EXPAL_START_AD;
    };
  }, [previewId, recordMode]);

  return (
    <div className="ad-root">
      <div
        className="ad-stage"
        data-ad-playing={playing ? "true" : "false"}
        data-ad-ready="true"
        data-beat={beat.id}
        data-kind={beat.kind}
      >
        {beat.kind === "hook" ? <HookScene /> : null}
        {beat.kind === "phone" ? <PhoneBeat beat={beat} /> : null}
        {beat.kind === "cta" ? <CtaScene caption={beat.caption} /> : null}
        {beat.kind !== "cta" && !recordMode ? (
          <p className={`ad-caption${beat.kind === "hook" ? " is-hook" : ""}`}>{beat.caption}</p>
        ) : null}
      </div>
    </div>
  );
}

function PhoneBeat({ beat }: { beat: AdBeat }) {
  return (
    <div className="ad-phone-stage is-on" data-scene={phoneScreenKey(beat)}>
      <div className="phone-frame">
        <div className="phone-screen">
          <ExpalApp
            key={phoneScreenKey(beat)}
            initialTab={beat.tab}
            initialOverlay={beat.overlay ?? null}
          />
        </div>
      </div>
    </div>
  );
}

export default function MarketingAdPage() {
  return (
    <Suspense fallback={null}>
      <MarketingAdInner />
    </Suspense>
  );
}
