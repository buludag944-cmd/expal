"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { displayName } from "@/lib/api";
import { SITE } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const { user, ready, logout } = useAuth();
  const onAdmin = pathname.startsWith("/admin");

  return (
    <header className="site-header">
      <div className="site-wrap header-inner">
        <Link href="/" className="brand" aria-label="EXPal home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/expal-logo.svg" alt="" width={40} height={40} />
          <span>
            EX<span>Pal</span>
            <small>{SITE.tagline}</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/#features" className={pathname === "/" ? "active" : ""}>
            Features
          </Link>
          <Link href="/#blog" className={pathname.startsWith("/blog") ? "active" : ""}>
            Blog
          </Link>
          <Link href="/blog">Guides</Link>
          {ready && user ? (
            <>
              <Link href="/account" className={pathname === "/account" ? "active" : ""}>
                {displayName(user).split(" ")[0] || "Account"}
              </Link>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Sign out
              </button>
              <Link className="btn" href={user.onboardingComplete ? "/account" : "/setup"}>
                {user.onboardingComplete ? "Open account" : "Finish setup"}
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" href="/login">
                Log in
              </Link>
              <Link className="btn" href="/signup">
                Sign up
              </Link>
            </>
          )}
          {onAdmin ? (
            <Link className="btn btn-secondary" href="/admin">
              Writer
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
