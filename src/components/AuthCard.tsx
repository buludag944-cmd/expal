"use client";

import Link from "next/link";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  mode: "login" | "signup";
};

export default function AuthCard({ mode }: Props) {
  const { error, user } = useAuth();
  const isSignup = mode === "signup";

  return (
    <div className="auth-card">
      <p className="eyebrow">{isSignup ? "New here" : "Welcome back"}</p>
      <h1 className="page-title">
        {isSignup ? "Set up your EXPal account" : "Log in to the web version"}
      </h1>
      <p className="lede">
        {isSignup
          ? "Create your free account with Gmail. We use the same Firebase Google sign-in as the EXPal app."
          : "Sign in with the Google account you use for EXPal. The journal stays public — you only need an account for community features."}
      </p>
      {user ? (
        <p className="ok">
          You are signed in as {user.email}.{" "}
          <Link href={user.onboardingComplete ? "/account" : "/setup"}>
            Continue
          </Link>
        </p>
      ) : (
        <GoogleAuthButton mode={mode} />
      )}
      {error ? <p className="error">{error}</p> : null}
      <p className="muted" style={{ marginTop: "1rem" }}>
        {isSignup ? (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        ) : (
          <>
            New to EXPal? <Link href="/signup">Set up an account</Link>
          </>
        )}
      </p>
    </div>
  );
}
