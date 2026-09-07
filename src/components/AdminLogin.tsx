"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not sign in");
        return;
      }
      window.location.reload();
    } catch {
      setError("Could not reach the server");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="section">
      <div className="site-wrap" style={{ maxWidth: 480 }}>
        <div className="section-head">
          <p className="eyebrow">Writer desk</p>
          <h1 className="page-title">Publish to the EXPal journal</h1>
          <p className="lede">
            Visitors never see this screen. The landing page and every published
            article stay public.
          </p>
        </div>
        <form className="form admin-card" style={{ padding: "1.4rem" }} onSubmit={onSubmit}>
          <label>
            Admin password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Open writer desk"}
          </button>
        </form>
      </div>
    </div>
  );
}
