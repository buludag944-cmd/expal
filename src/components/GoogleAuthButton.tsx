"use client";

import { useAuth } from "@/components/AuthProvider";

type Props = {
  mode: "login" | "signup";
};

export default function GoogleAuthButton({ mode }: Props) {
  const { busy, signInWithGoogle } = useAuth();

  async function onClick() {
    const next = await signInWithGoogle();
    if (next) window.location.assign(next);
  }

  return (
    <button
      type="button"
      className="btn google-btn"
      onClick={onClick}
      disabled={busy}
    >
      <span className="google-g" aria-hidden>
        G
      </span>
      {busy
        ? "Connecting…"
        : mode === "signup"
          ? "Set up account with Google"
          : "Log in with Google"}
    </button>
  );
}
