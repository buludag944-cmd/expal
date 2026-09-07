"use client";

import { useCallback, useState } from "react";
import ExpalApp, { type AppCaption } from "@/mobile/ExpalApp";
import "@/mobile/studio.css";

const INITIAL: AppCaption = {
  kicker: "Home",
  body: "Days in Dublin, visa pathway, and the tasks that still need doing.",
};

export default function MobileDemoPage() {
  const [caption, setCaption] = useState<AppCaption>(INITIAL);
  const onCaption = useCallback((next: AppCaption) => setCaption(next), []);

  return (
    <div className="studio">
      <section className="studio-copy">
        <div className="studio-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/expal-logo.svg" alt="" />
          <p className="eyebrow" style={{ margin: 0 }}>
            Mobile app
          </p>
        </div>
        <p className="eyebrow">Your friend away from home</p>
        <h1>
          EX<span>Pal</span>
        </h1>
        <p className="tagline">The mobile app for landing in a new country without getting lost in the admin.</p>
        <aside className="studio-caption" aria-live="polite">
          <small>{caption.kicker}</small>
          <p>{caption.body}</p>
        </aside>
      </section>
      <div className="phone-stage">
        <div className="phone-frame">
          <div className="phone-screen">
            <ExpalApp onCaption={onCaption} />
          </div>
        </div>
      </div>
    </div>
  );
}
