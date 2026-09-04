"use client";

import Link from "next/link";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { useAuth } from "@/components/AuthProvider";

export default function LandingAuth() {
  const { user, error } = useAuth();

  return (
    <section id="account" className="section">
      <div className="site-wrap">
        <div className="section-head">
          <p className="eyebrow">Web version</p>
          <h2>Sign up or log in with Gmail</h2>
          <p className="lede">
            Reading the journal never requires an account. When you want housing,
            referrals, or your visa checklist, set up a free account with Firebase
            Google sign-in — the same Gmail login as the EXPal app.
          </p>
        </div>
        {user ? (
          <div className="auth-card">
            <p className="ok">Signed in as {user.email}</p>
            <Link className="btn" href={user.onboardingComplete ? "/account" : "/setup"}>
              {user.onboardingComplete ? "Open your account" : "Finish account setup"}
            </Link>
          </div>
        ) : (
          <div className="auth-split">
            <div className="auth-card">
              <h3>Set up an account</h3>
              <p className="muted">New to EXPal? Create your free profile with Gmail.</p>
              <GoogleAuthButton mode="signup" />
              <p className="muted">
                <Link href="/signup">More about signing up</Link>
              </p>
            </div>
            <div className="auth-card">
              <h3>Log in</h3>
              <p className="muted">Already on EXPal? Continue with the same Google account.</p>
              <GoogleAuthButton mode="login" />
              <p className="muted">
                <Link href="/login">Go to the login page</Link>
              </p>
            </div>
          </div>
        )}
        {error ? <p className="error">{error}</p> : null}
      </div>
    </section>
  );
}
