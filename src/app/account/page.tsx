"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { displayName } from "@/lib/api";
import { SITE } from "@/lib/site";

export default function AccountPage() {
  const { user, ready, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (!user.onboardingComplete) router.replace("/setup");
  }, [ready, user, router]);

  if (!ready || !user || !user.onboardingComplete) {
    return (
      <div className="section">
        <div className="site-wrap">
          <p className="muted">Loading your account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="site-wrap" style={{ maxWidth: 640 }}>
        <div className="section-head">
          <p className="eyebrow">Your EXPal account</p>
          <h1 className="page-title">Hi, {displayName(user)}</h1>
          <p className="lede">
            You are logged in with Google on the web version. Housing, messages, and
            referrals live in the full app.
          </p>
        </div>
        <div className="admin-card" style={{ padding: "1.4rem" }}>
          <p>
            <strong>Email</strong>
            <br />
            {user.email}
          </p>
          {user.destinationCity ? (
            <p>
              <strong>Based around</strong>
              <br />
              {user.destinationCity}
              {user.destinationCountry ? `, ${user.destinationCountry}` : ""}
            </p>
          ) : null}
          <div className="hero-actions" style={{ marginTop: "1.2rem" }}>
            <a className="btn" href={SITE.appUrl}>
              Open the web app
            </a>
            <Link className="btn btn-secondary" href="/blog">
              Keep reading
            </Link>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
